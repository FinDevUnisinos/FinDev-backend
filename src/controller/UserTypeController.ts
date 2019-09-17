import {getConnection} from "typeorm";
import { UserType } from "../entity/UserType";

export class UserTypeController {
    getAll() {
        return getConnection().manager.find(UserType);
    }
}