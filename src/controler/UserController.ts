import {getConnection} from "typeorm";
import {User} from "../entity/User";

export class UserController {
    getAll() {
        return getConnection().manager.find(User);
    }
    getOne(idExt:number){
        const one =  getConnection()
            .getRepository(User)
            .createQueryBuilder("u")
            .where("u.id = :id", { id: idExt })
            .getOne();
        return one
    }

}