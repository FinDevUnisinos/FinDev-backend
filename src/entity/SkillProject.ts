import {
    Entity, 
    Column,
    BaseEntity,
    ManyToOne
} from "typeorm";
import { Skill } from "./Skill";
import { Project } from "./Project";

@Entity("SkillProject")
export class SkillProject extends BaseEntity {

    @ManyToOne(() => Project, project => project.skillsProject, { primary: true })
    project: Project;

    @ManyToOne(() => Skill, project => project.skillProject, { primary: true })
    skill: Skill;

    // level of the skill is 1 to 3
    @Column({ type: "bigint" , nullable: false})
    level: number;
}