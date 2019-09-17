import "reflect-metadata"
import express from "express"
import { config } from './config'
import {createConnection,getRepository,getConnection} from "typeorm";
import { UserController } from "./controller/UserController";
import { UserTypeController } from "./controller/UserTypeController";

const app = express();
const port = 3000;

createConnection({
  type: "postgres",
  host: config.host,
  port: 5432,
  username: config.user,
  password: config.password,
  database: config.database,
  schema:   config.scheme,
  entities: [
    __dirname + "/entity/*.ts"
  ],
  synchronize: true,
  logging: false,
  dropSchema: false
}).then(async connection => {
  // here you can start to work with your entities
  let allUsers= new UserController
  console.log(await allUsers.getUserById(1))
  console.log(await allUsers.getUsers())

  let allTypesUser= new UserTypeController
  console.log(await allTypesUser.getUserTypes())

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