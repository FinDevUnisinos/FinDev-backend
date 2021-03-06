import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity,
    ManyToMany,
    JoinTable,
    OneToMany,
} from "typeorm";
import { Skill } from "./Skill";
import { SkillUser } from "./SkillUser";
import { UserInterestProject } from "./UserInterestProject";

@Entity("User")
export class User extends BaseEntity {

    @PrimaryGeneratedColumn({ type: "bigint" })
    id: number;

    @Column({ type: "character varying", length: 256, nullable: false })
    name: string;

    @Column({ type: "character varying", length: 256, nullable: false, unique: true })
    email: string;

    @Column({ type: "character varying", length: 256, nullable: true })
    password: string;

    @Column({ type: "bool", nullable: false })
    active: boolean;

    @Column({ type: "bool", nullable: false })
    firstLogin: boolean;

    @Column({ type: "character varying", length: 40, nullable: false })
    userType: string;

    @OneToMany(() => SkillUser, skillUser => skillUser.user)
    skillsUser: SkillUser[];
    
    @OneToMany(() => UserInterestProject, userInterestProject => userInterestProject.user)
    interestsProjects: UserInterestProject[];

    NewUser(
        name: string,
        email: string,
        password: string,
        userType: string,
    ): void {
        this.name = name
        this.email = email
        this.password = password
        this.userType = userType
        this.active = true
        this.firstLogin = true
    }
}
