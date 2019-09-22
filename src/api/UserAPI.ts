import "reflect-metadata"
import express from "express"
import { asyncConnection } from "../connection";
import bodyParser from "body-parser";
import { UserController } from "../controller/UserController";
import { SessionController } from "../controller/SessionController";
import { User } from "../entity/User";

export let userApp = express();
var jsonParser = bodyParser.json()
let sessionController = new SessionController

userApp.post('/api/user/login',jsonParser, async (req, res) => {
    let userController= new UserController
    asyncConnection().then(async connection => {
      let email = req.body.email
      let password = sessionController.hashPassword(req.body.password)
      if ((await userController.veryfyPassword(email,password))!==undefined) {
        let user = await userController.getUserByEmail(email)
        let name = user.name
        res.send(sessionController.generateToken(name, email))
      }
      else{
        res.status(401).send(false)
      }
    })  
  });

userApp.get('/api/user/all',jsonParser, async (req, res) => {
    let userController= new UserController
    asyncConnection().then(async () => {
        res.send(await userController.getUsers())
    })
});
  
userApp.post('/api/user/oneByEmail',jsonParser, async (req, res) => {
    let userController= new UserController
    asyncConnection().then(async () => {
      let email = req.body.email
      res.send(await userController.getUserByEmail(email))
    })  
})
  
userApp.post('/api/user/insert',jsonParser, async (req, res) => {
    let userController= new UserController
    try {
      //find an existing user
      asyncConnection().then(async () => {
        let user = await userController.getUserByEmail(req.body.email.toString());
        if (user!=undefined){
            res.status(400).send("User already registered.");    
        } else{
            let createdUser = new User() 
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
