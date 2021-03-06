import {
    Entity,
    Column,
    BaseEntity,
    ManyToOne
} from "typeorm";
import { Project } from "./Project";
import { User } from "./User";

@Entity("UserInterestProject")
export class UserInterestProject extends BaseEntity {

    @ManyToOne(() => Project, project => project.interestsProject, { primary: true })
    project: Project;

    @ManyToOne(() => User, project => project.interestsProjects, { primary: true })
    user: User;

    @Column({ type: "bool", nullable: false })
    hasFreelancerInterest: boolean;

    @Column({ type: "bool", nullable: true })
    hasCompanyInterest: boolean;
}