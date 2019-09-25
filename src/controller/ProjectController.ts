import {getConnection, createQueryBuilder} from "typeorm";
import { Project } from "../entity/Project";
import { User } from "../entity/User";

export class ProjectController {
    addProject(project:Project){
        getConnection()
        .createQueryBuilder()
        .insert()
        .into(Project)
        .values(project)
        .execute();
    }
    
    getProjects() {
        return getConnection().manager.find(Project);
    }
 
    getProjectsWithSkills(user:User){
        if(user===undefined){
            return createQueryBuilder(Project)
            .leftJoinAndSelect("Project.skills", "skill")
            .getMany(); 
        } else{
            return createQueryBuilder(Project)
            .leftJoinAndSelect("Project.skills", "skill")
            .where({ownerUser: user})
            .getMany(); 
        }      
    }

    getWorkersOfProject(idExt:number){
        return getConnection()
        .getRepository(Project)
        .createQueryBuilder("p")
            .leftJoinAndSelect("p.workers", "user")
            .where("p.id = :id", { id: idExt })
            .getMany();       
    }


    getInterestsOfProject(idExt:number){
        return getConnection()
        .getRepository(Project)
        .createQueryBuilder("p")
            .leftJoinAndSelect("p.interests", "user")
            .where("p.id = :id", { id: idExt })
            .getMany();       
    }

    
    getProjectById(idExt:number){
        return  getConnection()
            .getRepository(Project)
            .createQueryBuilder("p")
            .where("p.id = :id", { id: idExt })
            .getOne();
    }

    getProjectsByOwner(user:User){
        return getConnection()
                .getRepository(Project)
                .find({ownerUser: user})
    }
   
}