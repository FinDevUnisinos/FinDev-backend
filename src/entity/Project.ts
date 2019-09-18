import {
    Entity, 
    Column,
    PrimaryGeneratedColumn, 
    BaseEntity,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { User } from "./User";

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

}