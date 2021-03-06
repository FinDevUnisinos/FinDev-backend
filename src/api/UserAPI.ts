import "reflect-metadata"
import express from "express"
import { asyncConnection } from "../connection";
import bodyParser from "body-parser";
import { UserController } from "../controller/UserController";
import { SessionController } from "../controller/SessionController";
import { User } from "../entity/User";
import { Route } from "../config/route";
import { authApp } from "./AuthAPI";
import { UserTypes } from "../entity/UserType";

export const userApp = express();
userApp.use(bodyParser.urlencoded({ extended: true }));
userApp.use(bodyParser.json());

const sessionController = new SessionController
const userController = new UserController
const route = new Route

userApp.post(route.getUserRoute() + '/login', async (req, res) => {

	const userController = new UserController

	asyncConnection().then(async connection => {
		const email = req.body.email
		const password = sessionController.hashPassword(req.body.password)

		if ((await userController.veryfyPassword(email, password)) !== undefined) {
			const user = await userController.getUserByEmail(email)
			const name = user.name
			res.send(sessionController.generateToken(name, email))
		}
		else {
			res.status(401).send(false)
		}
	})
});

userApp.get(route.getUserRoute() + '/all', authApp, async (req, res) => {

	const userController = new UserController

	asyncConnection().then(async () => {
		res.send(await userController.getUsers())
	})
});

userApp.post(route.getUserRoute() + '/getUser', authApp, async (req, res) => {

	const validToken = sessionController.validateToken(req.headers['x-access-token'].toString())

	asyncConnection().then(async () => {
		const user = await userController.getUserByEmail(validToken.body.email.toString())
		res.send(user)
	})
})

userApp.post(route.getUserRoute() + '/signup', async (req, res) => {

	const userController = new UserController

	try {
		asyncConnection().then(async () => {

			//find an existing user
			const user = await userController.getUserByEmail(req.body.email.toString());

			if (user != undefined) {
				res.status(400).send("User already registered.");
			} else {

				const createdUser = new User()
				createdUser.NewUser(
					req.body.name,
					req.body.email,
					sessionController.hashPassword(req.body.password),
					req.body.userType
				)

				userController.addUser(createdUser)
				res.send(sessionController.generateToken(createdUser.name, createdUser.email))

			}
		})
	} catch (error) {
		res.send("Failed to create user")
	}
});

userApp.post(route.getUserSkillsRoute() + '/insert', authApp, async (req, res, next) => {

	const validToken = sessionController.validateToken(req.headers['x-access-token'].toString())

	asyncConnection().then(async () => {

		const user = await userController.getUserByEmail(validToken.body.email.toString())

		if (user.userType === UserTypes.EMPLOYEE) {

			const skillId = Number.parseInt(req.body.skillId)
			const level = Number.parseInt(req.body.level)

			await userController.addSkillOnUser(user.id, skillId, level);
			res.send("Skill successfully inserted on User")

		} else {
			res.status(403).send("You cannot insert a skill on a user since you aren't an EMPLOYEE")
		}
	})
});

userApp.post(route.getUserSkillsRoute() + '/delete', authApp, async (req, res, next) => {

	const validToken = sessionController.validateToken(req.headers['x-access-token'].toString())

	asyncConnection().then(async () => {

		const user = await userController.getUserByEmail(validToken.body.email.toString())

		if (user.userType === UserTypes.EMPLOYEE) {

			const skillId = Number.parseInt(req.body.skillId)
			const skillIsMine = await userController.validateSkillIsMine(skillId, user)

			if (skillIsMine == true) {

				await userController.deleteSkillFromUser(user.id, skillId);
				res.send("Skill successfully deleted from User")

			} else {
				res.status(403).send("This Skill not yours!")
			}

		} else {
			res.status(403).send("You cannot delete a skill on an user since you aren't an EMPLOYEE")
		}
	})
});

userApp.post(route.getUserSkillsRoute() + '/all', authApp, async (req, res, next) => {

	const validToken = sessionController.validateToken(req.headers['x-access-token'].toString())

	asyncConnection().then(async () => {

		const user = await userController.getUserByEmail(validToken.body.email.toString())
		res.send(await userController.getUsersWithSkills(user))

	})
});

userApp.post(route.getUserProjectsRoute() + '/liked', authApp, async (req, res, next) => {

	const validToken = sessionController.validateToken(req.headers['x-access-token'].toString())

	asyncConnection().then(async () => {

		const user = await userController.getUserByEmail(validToken.body.email.toString())
		res.send(await userController.getUsersLikedProjects(user))

	})
});