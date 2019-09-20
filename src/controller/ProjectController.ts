import {getConnection} from "typeorm";
import { Project } from "../entity/Project";

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
        const one =  getConnection()
            .getRepository(Project)
            .createQueryBuilder("p")
            .where("p.id = :id", { id: idExt })
            .getOne();
        return one
    }
}