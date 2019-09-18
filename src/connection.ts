import "reflect-metadata"
import { config } from './config'
import { createConnection, getConnectionManager } from "typeorm";

export async function asyncConnection() { 
    try {
        return await createConnection({
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
    } catch (error) {
        // If AlreadyHasActiveConnectionError occurs, return already existent connection
        if (error.name === "AlreadyHasActiveConnectionError") {
            const existentConn = getConnectionManager().get("default");
            return existentConn;
        }
    }
    
}