import { getConnection, createQueryBuilder, getRepository, DeleteResult } from "typeorm";
import { User } from "../entity/User";
import { SkillController } from "./SkillController";
import { SkillUser } from "../entity/SkillUser";
import { Validator } from "../config/validator";

export class UserController {

    async validateSkillIsMine(skillId: number, user: User): Promise<boolean> {
        const skill = await this.getSkillFromUser(user.id,skillId)
        return skill == undefined ? false : true
    }

    addUser(usr: User): void {
        getConnection()
            .createQueryBuilder()
            .insert()
            .into(User)
            .values(usr)
            .execute();
    }

    getUsers(): Promise<User[]> {
        return getConnection().manager.find(User);
    }

    getSkillFromUser(userId: number, skillId: number): Promise<SkillUser> {
        const one = getConnection()
            .getRepository(SkillUser)
            .createQueryBuilder("su")
            .where("\"su\".\"userId\" = :userId", { userId: userId })
            .andWhere("\"su\".\"skillId\" = :skillId", { skillId: skillId })
            .getOne();
        return one
    }

    async addSkillOnUser(userId: number, skillId: number, level: number): Promise<void> {
        let skillController = new SkillController
        let userSkill = new SkillUser
        let validator = new Validator
        userSkill.level = validator.validateLevelSkill(level)
        userSkill.user = await this.getUserById(userId)
        userSkill.skill = await skillController.getSkillById(skillId)

        getConnection()
            .getRepository(SkillUser)
            .save(userSkill);
    }

    deleteSkillFromUser(userId: number, skillId: number): Promise<DeleteResult> {
        return getConnection()
            .createQueryBuilder()
            .delete()
            .from(SkillUser)
            .where("\"userId\" = :userId", { userId: userId })
            .andWhere("\"skillId\" = :skillId", { skillId: skillId })
            .execute();
    }

    getUsersWithSkills(user: User): Promise<User[]> {
        if (!user) {
            return createQueryBuilder(User)
                .leftJoinAndSelect("User.skillsUser", "skillUser")
                .leftJoinAndSelect("skillUser.skill", "skill")
                .getMany();
        } else {
            return createQueryBuilder(User)
                .leftJoinAndSelect("User.skillsUser", "skillUser")
                .leftJoinAndSelect("skillUser.skill", "skill")
                .where({ id: user.id })
                .getMany();
        }
    }

    getUserById(idExt: number): Promise<User> {
        const one = getConnection()
            .getRepository(User)
            .createQueryBuilder("u")
            .where("u.id = :id", { id: idExt })
            .getOne();
        return one
    }

    getUserByEmail(emailExt: string): Promise<User> {
        const one = getConnection()
            .getRepository(User)
            .createQueryBuilder("u")
            .where("u.email like :email", { email: emailExt })
            .getOne();
        return one
    }

    veryfyPassword(emailExt: string, passwordExt: string): Promise<User> {
        const one = getConnection()
            .getRepository(User)
            .createQueryBuilder("u")
            .where("u.email = :email", { email: emailExt })
            .andWhere("u.password = :password", { password: passwordExt })
            .getOne();
        return one
    }

}
