import {getConnection} from "typeorm";
import { Project } from "../entity/Project";
import { Skill } from "../entity/Skill";

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

    getProjectById(idExt:number){
        return  getConnection()
            .getRepository(Project)
            .createQueryBuilder("p")
            .where("p.id = :id", { id: idExt })
            .getOne();
    }

    getProjectsByOwner(idExt:number){
        return getConnection()
            .getRepository(Project)
            .createQueryBuilder("p")
            .where("p.ownerUser = :idOwnerUser", { idOwnerUser: idExt })
            .getMany();
    }

}