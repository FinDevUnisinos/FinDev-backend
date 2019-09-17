import {getConnection} from "typeorm";
import { UserType } from "../entity/UserType";

export class UserTypeController {
    getUserTypes() {
        return getConnection().manager.find(UserType);
    }
}