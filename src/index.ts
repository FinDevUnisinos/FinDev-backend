import "reflect-metadata"
import express from "express"
import { asyncConnection } from "./connection";
import { UserController } from "./controller/UserController";
import { User } from "./entity/User";
import bodyParser from "body-parser";
import cors from 'cors'
import { SessionController } from "./controller/SessionController";

const app = express();
app.use(cors())
const port = 3000;
var jsonParser = bodyParser.json()

app.get('/', (req, res) => {
  res.send('Running');
});

app.get('/api/user/all', async (req, res) => {
  asyncConnection().then(async () => {
      let uc= new UserController
      res.send(await uc.getUsers())
  })
});

/* ONLY FOR TESTS of token verify
{
	"token":"blablabalbalba"
}
*/
app.post('/api/user/validToken',jsonParser, (req,res) =>{
  let session = new SessionController
  res.send(session.validToken(req.body.token))
})

/* ONLY FOR TESTS of convert passwd
{
	"password":"teste"
}
*/
app.post('/api/user/hassPass',jsonParser, (req,res) =>{
  let session = new SessionController
  let converted =session.hashPassword(req.body.password)
  res.send(converted)
});

/*
JSON Default for find email and passwd
  {
  "email":"gianboschetti@icloud.com",
  "password":"teste"
  }
*/
app.post('/api/user/login', jsonParser, async (req, res) => {
  asyncConnection().then(async connection => {
    let uc= new UserController
    let session = new SessionController
    let email = req.body.email
    let password = session.hashPassword(req.body.password)
    if ((await uc.veryfyPassword(email,password))!==undefined) {
      let user = await uc.getUserByEmail(email)
      let name = user.name
      res.send(session.generateToken(name, email))
    }
    else{
      res.status(401).send(false)
    }
  })  
})

/*
JSON Default for find by email
  {
  "email":"g.b@mail.com"
  }
*/
app.post('/api/user/oneByEmail', jsonParser, async (req, res) => {
  asyncConnection().then(async () => {
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
      let session = new SessionController
      let uc= new UserController
      let createdUser = new User() 
      createdUser.NewUser(
        req.body.name,
        req.body.email,
        session.hashPassword(req.body.password),
        req.body.usertype
      )
      asyncConnection().then(async () => {
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