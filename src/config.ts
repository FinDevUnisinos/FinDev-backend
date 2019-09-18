import dotenv from 'dotenv'
dotenv.config();

export interface IConfigType {
    user: string,
    host: string,
    database: string,
    password: string,
    port: string,
    scheme: string,
}

export const config: IConfigType = {
    user: process.env.user,
    host: process.env.host,
    database: process.env.database,
    password: process.env.password,
    port: process.env.port,
    scheme: process.env.scheme
}

export const njwtSecret: string = "hKGA9LPJkF4zYhFdX9Ju1vfBAy6P5Kkh"