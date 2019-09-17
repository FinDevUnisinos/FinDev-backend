import "reflect-metadata"
import { config } from './config'
import { createConnection } from "typeorm";

export async function asyncConnection() { 
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
    })
}