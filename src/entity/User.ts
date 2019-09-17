import {
    Entity, 
    Column,
    PrimaryGeneratedColumn, 
    BaseEntity,
} from "typeorm";

@Entity("User")
export class User extends BaseEntity {

    @PrimaryGeneratedColumn({ type: "bigint"})
    id: number;

    @Column({ type: "character varying" , length: 256, nullable: false})
    name: string;

    @Column({ type: "character varying" , length: 256, nullable: false, unique: true})
    email: string;

    @Column({ type: "character varying" , length: 256 , nullable: true})
    password: string;

    @Column({ type: "bool", nullable: false} )
    active: boolean;

    @Column({ type: "bool", nullable: false})
    firstLogin: boolean;

    @Column({  type: "character varying" , length: 40 , nullable: false} )
    userType: string;
}
