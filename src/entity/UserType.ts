import {
    Entity,
    Column, 
    PrimaryGeneratedColumn, 
    BaseEntity
} from "typeorm";

@Entity("UserType")
export class UserType extends BaseEntity {
    
    @PrimaryGeneratedColumn({ type: "bigint"})
    id: number;

    @Column({ type: "character varying" , length: 40})
    description: string;

}