import {getConnection} from "typeorm";
import {User} from "../entity/User";

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

}