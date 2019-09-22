import {getConnection, createQueryBuilder} from "typeorm";
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

    getUsersWithSkills(user:User){
        if(user===undefined){
            return createQueryBuilder(User)
            .leftJoinAndSelect("User.skills", "skill")
            .getMany(); 
        } else{
            return createQueryBuilder(User)
            .leftJoinAndSelect("User.skills", "skill")
            .where({id: user.id})
            .getMany(); 
        }      
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
            .where("u.email like :email", { email: emailExt })
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

}
