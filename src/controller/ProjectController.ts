import {getConnection, createQueryBuilder} from "typeorm";
import { Project } from "../entity/Project";
import { User } from "../entity/User";
import { SkillProject } from "../entity/SkillProject";
import { SkillController } from "./SkillController";
import { Validator } from "../config/validator";

export class ProjectController {
    addProject(project:Project):void{
        getConnection()
        .createQueryBuilder()
        .insert()
        .into(Project)
        .values(project)
        .execute();
    }

    async addSkillOnProject(projectId:number, skillId:number, level:number):Promise<void>{
        let skillController = new SkillController
        let projSkill = new SkillProject
        let validator = new Validator
        projSkill.level = validator.validateLevelSkill(level)
        projSkill.project = await this.getProjectById(projectId)
        projSkill.skill = await skillController.getSkillById(skillId)

        getConnection()
        .createQueryBuilder()
        .insert()
        .into(SkillProject)
        .values(projSkill)
        .execute();
    }

    addWorkerOnProject(projectId:number, userId:number):void{
        getConnection()
        .createQueryBuilder()
        .relation(Project, "workers")
        .of(projectId)
        .add(userId);
    }

    addInterestOnProject(projectId:number, userId:number):void{
        getConnection()
        .createQueryBuilder()
        .relation(Project, "interests")
        .of(projectId)
        .add(userId);
    }
    
    getProjects():Promise<Project[]>{
        return getConnection().manager.find(Project);
    }
 
    getProjectsWithSkills(user:User):Promise<Project[]>{
        if(!user){
            return createQueryBuilder(Project)
                .leftJoinAndSelect( "Project.skillsProject","skillProject")
                .leftJoinAndSelect( "skillProject.skill","skill")
                .getMany(); 
        } else{
            return createQueryBuilder(Project)
                .leftJoinAndSelect( "Project.skillsProject","skillProject")
                .leftJoinAndSelect( "skillProject.skill","skill")
                .where({ownerUser: user.id})
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