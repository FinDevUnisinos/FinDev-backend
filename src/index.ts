import "reflect-metadata"
import express from "express"
import { asyncConnection } from "./connection";
import { UserController } from "./controller/UserController";
import { SessionController } from "./controller/SessionController";
import { ProjectController } from "./controller/ProjectController";
import { User } from "./entity/User";
import bodyParser from "body-parser";
import cors from 'cors'

const app = express();
app.use(cors())
app.use(bodyParser.json())

const port = 3000;

var jsonParser = bodyParser.json()
let sessionController = new SessionController
let projectController= new ProjectController
let userController= new UserController

app.get('/', (req, res) => {
  res.send('Running');
});

app.post('/api/project/allByOwner', async (req, res, next) => {
  var token = req.headers['x-access-token']
  if (token) {
    let validToken = sessionController.validateToken(token.toString())
    if(validToken!=undefined){
      asyncConnection().then(async () => {
        let user = await userController.getUserByEmail(validToken.body.email)
        res.send(await projectController.getProjectsByOwner(user.id))
      })
    } else {
      res.send("Invalid Token")
    }
  } else{
    res.send("Pass some Token in header")
  }
})

app.get('/api/user/all', async (req, res) => {
  asyncConnection().then(async () => {
      let userController= new UserController
      res.send(await userController.getUsers())
  })
});

app.post('/api/user/validToken', (req,res) =>{
  let session = new SessionController
  res.send(session.validateToken(req.body.token))
})

app.post('/api/user/hassPass', (req,res) =>{
  let session = new SessionController
  let converted =session.hashPassword(req.body.password)
  res.send(converted)
});

app.post('/api/user/login', async (req, res) => {
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
})

app.post('/api/user/oneByEmail', async (req, res) => {
  asyncConnection().then(async () => {
    let email = req.body.email
    res.send(await userController.getUserByEmail(email))
  })  
})

app.post('/api/user/insert', async (req, res) => {
  try {
    //find an existing user
    let user = await userController.getUserByEmail(req.body.email);
    if (user) return res.status(400).send("User already registered.");

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

app.listen(port, err => {
  if (err) {
    return console.error(err);
  }
  return console.log(`server is listening on ${port}`);
});