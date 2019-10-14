import {
    Entity, 
    Column,
    BaseEntity,
    ManyToOne
} from "typeorm";
import { Skill } from "./Skill";
import { User } from "./User";

@Entity("SkillUser")
export class SkillUser extends BaseEntity {

    @ManyToOne(() => User, User => User.skillsUser, { primary: true })
    user: User;

    @ManyToOne(() => Skill, User => User.skillProject, { primary: true })
    skill: Skill;

    // level of the skill is 1 to 3
    @Column({ type: "bigint" , nullable: false})
    level: number;
}