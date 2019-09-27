import {
    Entity, 
    Column,
    PrimaryGeneratedColumn, 
    BaseEntity
} from "typeorm";

@Entity("Skill")
export class Skill extends BaseEntity {

    @PrimaryGeneratedColumn({ type: "bigint"})
    id: number;
    
    @Column({ type: "character varying" , length: 256, nullable: false})
    description: string;
}