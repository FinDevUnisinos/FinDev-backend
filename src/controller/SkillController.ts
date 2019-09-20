import {getConnection} from "typeorm";
import {Skill} from "../entity/Skill";

export class SkillController {
    addSkill(skill:Skill){
        getConnection()
        .createQueryBuilder()
        .insert()
        .into(Skill)
        .values(skill)
        .execute();
    }
    
    getSkills() {
        return getConnection().manager.find(Skill);
    }

    getSkillById(idExt:number){
        const one =  getConnection()
            .getRepository(Skill)
            .createQueryBuilder("s")
            .where("s.id = :id", { id: idExt })
            .getOne();
        return one
    }