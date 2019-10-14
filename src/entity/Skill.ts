import {
    Entity, 
    Column,
    PrimaryGeneratedColumn, 
    BaseEntity,
    OneToMany
} from "typeorm";
import { SkillProject } from "./SkillProject";
import { SkillUser } from "./SkillUser";

@Entity("Skill")
export class Skill extends BaseEntity {

    @PrimaryGeneratedColumn({ type: "bigint"})
    id: number;
    
    @Column({ type: "character varying" , length: 256, nullable: false})
    description: string;

    @OneToMany(() => SkillProject, skillProject => skillProject.skill)
    skillProject: SkillProject[];

    @OneToMany(() => SkillUser, skillUser => skillUser.skill)
    skillUser: SkillUser[];
}