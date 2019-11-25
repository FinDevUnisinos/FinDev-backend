import { getConnection, InsertResult } from "typeorm";
import { Skill } from "../entity/Skill";

export class SkillController {
    async addSkill(skill: Skill): Promise<InsertResult> {
        return (
            await getConnection()
                .createQueryBuilder()
                .insert()
                .into(Skill)
                .values(skill)
                .execute()
        )
    }

    getSkills(): Promise<Skill[]> {
        return getConnection().manager.find(Skill);
    }

    getSkillById(idExt: number): Promise<Skill> {
        const one = getConnection()
            .getRepository(Skill)
            .createQueryBuilder("s")
            .where("s.id = :id", { id: idExt })
            .getOne();
        return one
    }
}