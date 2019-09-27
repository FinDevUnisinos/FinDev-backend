import "reflect-metadata"
import express from "express"
import { asyncConnection } from "../connection";
import bodyParser from "body-parser";
import { UserController } from "../controller/UserController";
import { SessionController } from "../controller/SessionController";
import { User } from "../entity/User";
import { Route } from "../config/route";
import { authApp } from "./AuthAPI";

export const userApp = express();
userApp.use(bodyParser.urlencoded({ extended: true }));
userApp.use(bodyParser.json());

const sessionController = new SessionController
const userController = new UserController
const route = new Route

userApp.post(route.getUserRoute()+'/login', async (req, res) => {
	const userController= new UserController
	asyncConnection().then(async connection => {
		const email = req.body.email
		const password = sessionController.hashPassword(req.body.password)
		if ((await userController.veryfyPassword(email,password))!==undefined) {
			const user = await userController.getUserByEmail(email)
			const name = user.name
			res.send(sessionController.generateToken(name, email))
		}
		else{
			res.status(401).send(false)
		}
	})  
});

userApp.get(route.getUserRoute()+'/all', authApp, async (req, res) => {
	const userController= new UserController
	asyncConnection().then(async () => {
		res.send(await userController.getUsers())
	})
});
  
userApp.post(route.getUserRoute()+'/oneByEmail',authApp, async (req, res) => {
	const userController= new UserController
	asyncConnection().then(async () => {
		const email = req.body.email
		res.send(await userController.getUserByEmail(email))
	})  
})
  
userApp.post(route.getUserRoute()+'/insert', async (req, res) => {
	const userController= new UserController
	try {
	//find an existing user
	asyncConnection().then(async () => {
		const user = await userController.getUserByEmail(req.body.email.toString());
		if (user!=undefined){
			res.status(400).send("User already registered.");    
		} else{
			const createdUser = new User() 
			createdUser.NewUser(
			req.body.name,
			req.body.email,
			sessionController.hashPassword(req.body.password),
			req.body.usertype
			)
			userController.addUser(createdUser)
			res.send("User successfully created")
		} 
	})
	} catch (error) {
		res.send("Failed to create user")
	}
});

userApp.post(route.getUserRoute()+'/skills', authApp, async (req, res, next) => {
	const validToken = sessionController.validateToken(req.headers['x-access-token'].toString())
	asyncConnection().then(async () => {    
		const user = await userController.getUserByEmail(validToken.body.email.toString())
		res.send(await userController.getUsersWithSkills(user))
	})
});