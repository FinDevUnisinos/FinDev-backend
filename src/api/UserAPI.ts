import "reflect-metadata"
import express from "express"
import { asyncConnection } from "../connection";
import bodyParser from "body-parser";
import { UserController } from "../controller/UserController";
import { SessionController } from "../controller/SessionController";
import { User } from "../entity/User";

export const userApp = express();
userApp.use(bodyParser.urlencoded({ extended: true }));
userApp.use(bodyParser.json());

const sessionController = new SessionController
const userController = new UserController

userApp.post('/api/user/login', async (req, res) => {
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

userApp.get('/api/user/all', async (req, res) => {
    const userController= new UserController
    asyncConnection().then(async () => {
        res.send(await userController.getUsers())
    })
});
  
userApp.post('/api/user/oneByEmail', async (req, res) => {
    const userController= new UserController
    asyncConnection().then(async () => {
      const email = req.body.email
      res.send(await userController.getUserByEmail(email))
    })  
})
  
userApp.post('/api/user/insert', async (req, res) => {
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

userApp.post('/api/user/skills', async (req, res, next) => {
    const token = req.headers['x-access-token']
    if (token) {
      const validToken = sessionController.validateToken(token.toString())
      if(validToken!=undefined){
        asyncConnection().then(async () => {    
          const user = await userController.getUserByEmail(validToken.body.email.toString())
          res.send(await userController.getUsersWithSkills(user))
        })
      } else {
        res.status(401).send("Invalid Token")
      }
    } else{
      res.status(401).send("Pass some Token in header")
    }
});