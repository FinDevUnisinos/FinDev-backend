import "reflect-metadata"
import express from "express"
import { asyncConnection } from "./connection";
import { UserController } from "./controller/UserController";
import { User } from "./entity/User";
import bodyParser from "body-parser";
import cors from 'cors'

const app = express();
app.use(cors())
const port = 3000;
var jsonParser = bodyParser.json()

app.get('/', (req, res) => {
  res.send('Running');
});

app.get('/api/user/all', async (req, res) => {
  asyncConnection().then(async () => {
      let userController= new UserController
      res.send(await userController.getUsers())
  })
});

app.post('/api/user/validToken',jsonParser, (req,res) =>{
  let userController= new UserController
  res.send(userController.validToken(req.body.token))
})

app.post('/api/user/hassPass',jsonParser, (req,res) =>{
  let userController= new UserController
  let converted =userController.hashPassword(req.body.password)
  res.send(converted)
});

app.post('/api/user/login', jsonParser, async (req, res) => {
  asyncConnection().then(async connection => {
    let userController= new UserController
    let email = req.body.email
    let password = userController.hashPassword(req.body.password)
    if ((await userController.veryfyPassword(email,password))!==undefined) {
      let user = await userController.getUserByEmail(email)
      let name = user.name
      res.send(userController.generateToken(name, email))
    }
    else{
      res.status(401).send(false)
    }
  })  
})

app.post('/api/user/oneByEmail', jsonParser, async (req, res) => {
  asyncConnection().then(async () => {
    let userController= new UserController
    let email = req.body.email
    res.send(await userController.getUserByEmail(email))
  })  
})

app.post('/api/user/insert', jsonParser, async (req, res) => {
  try {
      let createdUser = new User()
      let userController= new UserController
 
      createdUser.NewUser(
        req.body.name,
        req.body.email,
        userController.hashPassword(req.body.password),
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