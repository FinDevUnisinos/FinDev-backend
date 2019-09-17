import "reflect-metadata"
import { config } from './config'
import { createConnection } from "typeorm";
import { UserController } from "./controller/UserController";

export async function asyncConnection() { 
    try {
        let connection = await createConnection({
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
          
          }).catch(error => console.log(error));
          
    }catch (err) {
        console.log(err)
    }
}