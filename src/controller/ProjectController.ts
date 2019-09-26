import {getConnection, createQueryBuilder} from "typeorm";
import { Project } from "../entity/Project";
import { User } from "../entity/User";

export class ProjectController {
    addProject(project:Project):void{
        getConnection()
        .createQueryBuilder()
        .insert()
        .into(Project)
        .values(project)
        .execute();
    }
    
    getProjects():Promise<Project[]>{
        return getConnection().manager.find(Project);
    }
 
    getProjectsWithSkills(user:User):Promise<Project[]>{
        if(!user){
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

    getWorkersOfProject(idExt:number):Promise<Project[]>{
        return getConnection()
        .getRepository(Project)
        .createQueryBuilder("p")
            .leftJoinAndSelect("p.workers", "user")
            .where("p.id = :id", { id: idExt })
            .getMany();       
    }

    getInterestsOfProject(idExt:number):Promise<Project[]>{
        return getConnection()
        .getRepository(Project)
        .createQueryBuilder("p")
            .leftJoinAndSelect("p.interests", "user")
            .where("p.id = :id", { id: idExt })
            .getMany();       
    }

    getProjectById(idExt:number):Promise<Project>{
        return  getConnection()
            .getRepository(Project)
            .createQueryBuilder("p")
            .where("p.id = :id", { id: idExt })
            .getOne();
    }

    getProjectsByOwner(user:User):Promise<Project[]>{
        return getConnection()
                .getRepository(Project)
                .find({ownerUser: user})
    }
   
}