import "reflect-metadata"
import express from "express"
import { asyncConnection } from "./connection";


import { UserController } from "./controller/UserController";
import { User } from "./entity/User";
import { UserTypes } from "./entity/UserType";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
var jsonParser = bodyParser.json()

app.get('/', (req, res) => {
  res.send('Running');
});

app.get('/api/user/all', async (req, res) => {
  asyncConnection().then(async connection => {
      let uc= new UserController
      res.send(await uc.getUsers())
  })
});

/*
JSON Default for find email and passwd
  {
  "email":"gianboschetti@icloud.com",
  "password":"teste"
  }
*/
app.post('/api/user/verifyPasswd', jsonParser, async (req, res) => {
  asyncConnection().then(async connection => {
    let uc= new UserController
    let email = req.body.email
    let password = req.body.password
    res.send((await uc.veryfyPassword(email,password))!==undefined)
  })  
})

/*
JSON Default for find by email
  {
  "email":"g.b@mail.com"
  }
*/
app.post('/api/user/oneByEmail', jsonParser, async (req, res) => {
  asyncConnection().then(async connection => {
    let uc= new UserController
    let email = req.body.email
    res.send(await uc.getUserByEmail(email))
  })  
})

/*
JSON Default for Insert
  {
  "name":"Teste",
  "password":"Gian",
  "email":"gb@icloud.com",
  "usertype":"EMPLOYEE"
  }
*/
app.post('/api/user/insert', jsonParser, async (req, res) => {
  try {
      let createdUser = new User()
      createdUser.NewUser(
        req.body.name,
        req.body.email,
        req.body.password,
        req.body.usertype
      )
      asyncConnection().then(async connection => {
          let uc= new UserController
          uc.addUser(createdUser)
          res.send("User Inserted on Database")
    })
  } catch (error) {
    res.send("User Doesn't Inserted on Database")
  }
});




app.listen(port, err => {
  if (err) {
    return console.error(err);
  }
  return console.log(`server is listening on ${port}`);
});