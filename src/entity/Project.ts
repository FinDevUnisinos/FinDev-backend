import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity,
    ManyToOne,
    JoinColumn,
    ManyToMany,
    JoinTable,
    OneToMany,
} from "typeorm";
import { User } from "./User";
import { SkillProject } from "./SkillProject";
import { UserInterestProject } from "./UserInterestProject";

@Entity("Project")
export class Project extends BaseEntity {

    @PrimaryGeneratedColumn({ type: "bigint" })
    id: number;

    @Column({ type: "character varying", length: 256, nullable: false })
    name: string;

    @Column({ type: "character varying", length: 1024, nullable: true })
    description: string;

    @Column({ type: "bool", nullable: false })
    closed: boolean;

    @ManyToOne(() => User, u => u.id)
    @JoinColumn({ name: "idOwnerUser" })
    ownerUser: User;

    @OneToMany(() => SkillProject, skillProject => skillProject.project)
    skillsProject: SkillProject[];

    @ManyToMany(type => User)
    @JoinTable({ name: "UserWorkingProject" })
    workers: User[];

    @OneToMany(() => UserInterestProject, userInterestProject => userInterestProject.project)
    interestsProject: UserInterestProject[];

    newProject(
        name: string,
        description: string,
        closed: boolean,
        ownerUser: User,
    ): void {
        this.name = name
        this.description = description
        this.closed = closed == undefined ? false : closed
        this.ownerUser = ownerUser
    }

}