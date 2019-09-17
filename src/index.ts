import "reflect-metadata"
import express from "express"
import { config } from './config'
import {createConnection,getRepository,getConnection} from "typeorm";
import { User } from "./entity/User";
import { UserType } from "./entity/UserType";
import {PoolConfig, Pool} from "pg";
import { UserController } from "./controler/UserController";


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
  const firstUser = await connection
    .getRepository(User)
    .createQueryBuilder("u")
    .where("u.id = :id", { id: 1 })
    .getOne();
  console.log(firstUser)

  let s= new UserController
  console.log(await s.getAll())

}).catch(error => console.log(error));

// let s= new UserController
// s.getAll()



// const pool = new Pool(config);
// pool.query(`SELECT * FROM findev.\"User\"`, (err, res) => {
//   console.log(err, res);
//   pool.end();
// });

app.get('/', (req, res) => {
  res.send('Running');
});

app.listen(port, err => {
  if (err) {
    return console.error(err);
  }
  return console.log(`server is listening on ${port}`);
});