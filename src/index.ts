import "reflect-metadata"
import express from "express"
import { asyncConnection } from "./connection";
import { UserController } from "./controller/UserController";
import { SessionController } from "./controller/SessionController";
import { ProjectController } from "./controller/ProjectController";
import { User } from "./entity/User";
import bodyParser from "body-parser";
import cors from 'cors'
import { Project } from "./entity/Project";
import { UserTypes } from "./entity/UserType";

const app = express();
app.use(cors())
const port = 3000;

var jsonParser = bodyParser.json()
let sessionController = new SessionController
let projectController= new ProjectController
let userController= new UserController

app.get('/', (req, res) => {
  res.send('Running');
});

//region requests to SESSION
app.post('/api/user/login',jsonParser, async (req, res) => {
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
//endregion requests to SESSION


//region requests to USER
app.get('/api/user/all',jsonParser, async (req, res) => {
  asyncConnection().then(async () => {
      res.send(await userController.getUsers())
  })
});

app.post('/api/user/oneByEmail',jsonParser, async (req, res) => {
  asyncConnection().then(async () => {
    let email = req.body.email
    res.send(await userController.getUserByEmail(email))
  })  
})

app.post('/api/user/insert',jsonParser, async (req, res) => {
  try {
    //find an existing user
    let user = await userController.getUserByEmail(req.body.email.toString());
    if (user.email!=undefined) return res.status(400).send("User already registered.");

    let createdUser = new User() 
    createdUser.NewUser(
      req.body.name,
      req.body.email,
      sessionController.hashPassword(req.body.password),
      req.body.usertype
    )
    asyncConnection().then(async () => {
        userController.addUser(createdUser)
        res.send("User successfully created")
    })
  } catch (error) {
    res.send("Failed to create user")
  }
});
//endregion requests to USER

//region requests to PROJECT
app.post('/api/project/allByOwner',jsonParser, async (req, res, next) => {
  var token = req.headers['x-access-token']
  if (token) {
    let validToken = sessionController.validateToken(token.toString())
    if(validToken!=undefined){
      asyncConnection().then(async () => {
        let user = await userController.getUserByEmail(validToken.body.email)
        res.send(await projectController.getProjectsByOwner(user.id))
      })
    } else {
      res.status(400).send("Invalid Token")
    }
  } else{
    res.status(400).send("Pass some Token in header")
  }
});

app.post('/api/project/insert',jsonParser, async (req, res, next) => {
  var token = req.headers['x-access-token']
  if (token) {
    let validToken = sessionController.validateToken(token.toString())
    if(validToken!=undefined){
      asyncConnection().then(async () => {    
        let user = await userController.getUserByEmail(validToken.body.email.toString())
        if(user.userType === UserTypes.COMPANY){
          let project = new Project
          project.newProject(
            req.body.name,
            req.body.description,
            req.body.closed,
            user
          )
          await projectController.addProject(project)
          res.send("Project successfully created")
        } else {
          res.status(403).send("You Have no access to create a project")
        }
      })
    } else {
      res.status(400).send("Invalid Token")
    }
  } else{
    res.status(400).send("Pass some Token in header")
  }
});

//endregion requests to PROJECT


//region requests to tests Only
app.post('/api/user/validToken',jsonParser, (req,res) =>{
  res.send(sessionController.validateToken(req.body.token))
})

app.post('/api/user/hassPass',jsonParser, (req,res) =>{
  let converted =sessionController.hashPassword(req.body.password)
  res.send(converted)
});
//endregion requests to tests Only

app.listen(port, err => {
  if (err) {
    return console.error(err);
  }
  return console.log(`server is listening on ${port}`);
});