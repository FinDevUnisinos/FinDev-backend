import {getConnection} from "typeorm";
import {User} from "../entity/User";
import { njwtSecret } from "../config";

export class UserController {
    addUser(usr:User){
        getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values(usr)
        .execute();
    }
    
    getUsers() {
        return getConnection().manager.find(User);
    }

    getUserById(idExt:number){
        const one =  getConnection()
            .getRepository(User)
            .createQueryBuilder("u")
            .where("u.id = :id", { id: idExt })
            .getOne();
        return one
    }

    getUserByEmail(emailExt:string){
        const one =  getConnection()
            .getRepository(User)
            .createQueryBuilder("u")
            .where("u.email = :email", { email: emailExt })
            .getOne();
        return one
    }

    veryfyPassword(emailExt:string, passwordExt:string){
        const one =  getConnection()
            .getRepository(User)
            .createQueryBuilder("u")
            .where("u.email = :email", { email: emailExt })
            .andWhere("u.password = :password", { password: passwordExt })
            .getOne();
        return one
    }

    generateToken(name:string, email:string){
        var nJwt = require('njwt');
        var claims = {
        "name": name,
        "email": email,
        "jti": "48c1dd1c-d526-4f06-a3af-6223695e2f89",
        "iat": 1568777437,
        "exp": 1568781037
        }
        
        var jwt = nJwt.create(claims,njwtSecret,"HS256");
        var token = jwt.compact();

        return token
    }

    hashPassword(password:string){
        var hash = require('hash.js')
        return hash.sha256().update(password).digest('hex')
    }

}