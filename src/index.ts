import "reflect-metadata"
import express from "express"
import {asyncConnection} from "./connection"
import { UserController } from "./controller/UserController"

const app = express();
const port = 3000;

asyncConnection().then(async connection => {
  // here you can start to work with your entities
  let allUsers= new UserController
  console.log(await allUsers.getUserById(1))
  console.log(await allUsers.getUsers())
}).catch(error => console.log(error));

app.get('/', (req, res) => {
  res.send('Running');
});

app.listen(port, err => {
  if (err) {
    return console.error(err);
  }
  return console.log(`server is listening on ${port}`);
});