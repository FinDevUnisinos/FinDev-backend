import {
    Entity, 
    Column,
    PrimaryGeneratedColumn, 
    BaseEntity,
    ManyToOne,
    JoinColumn,
    ManyToMany,
    JoinTable,
} from "typeorm";
import { User } from "./User";
import { Skill } from "./Skill";

@Entity("Project")
export class Project extends BaseEntity {

    @PrimaryGeneratedColumn({ type: "bigint"})
    id: number;

    @Column({ type: "character varying" , length: 256, nullable: false})
    name: string;
    
    @Column({ type: "character varying" , length: 1024, nullable: true})
    description: string;

    @Column({ type: "bool", nullable: false})
    closed: boolean;

    @ManyToOne(() => User, u => u.id)
    @JoinColumn({ name: "idOwnerUser"})
    ownerUser: User;

    @ManyToMany(type => Skill)
    @JoinTable({name: "SkillProject"})
    skills: Skill[];

    @ManyToMany(type => User)
    @JoinTable({name: "UserWorkingProject"})
    workers: User[];

    @ManyToMany(type => User)
    @JoinTable({name: "UserInterestProject"})
    interests: User[];

}