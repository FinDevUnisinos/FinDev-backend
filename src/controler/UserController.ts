import {getConnection} from "typeorm";
import {User} from "../entity/User";

export class UserController {
    getAll() {
        return getConnection().manager.find(User);
    }

}