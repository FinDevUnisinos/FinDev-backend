import {getConnection} from "typeorm";
import {User} from "../entity/User";

export class UserController {
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

}