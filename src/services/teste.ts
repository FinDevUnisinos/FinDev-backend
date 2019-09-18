import { UserController } from "../controller/UserController"

let ucGlobal= new UserController
let converted =ucGlobal.hashPassword("teste")
console.log(converted)