import {
    Entity, 
    Column,
    PrimaryGeneratedColumn, 
    ManyToOne,
    BaseEntity,
    JoinColumn
} from "typeorm";
import { UserType } from './UserType'

@Entity("User")
export class User extends BaseEntity {

    @PrimaryGeneratedColumn({ type: "bigint"})
    id: number;

    @Column({ type: "character varying" , length: 256, nullable: true})
    name: string;

    @Column({ type: "character varying" , length: 256, nullable: false, unique: true})
    email: string;

    @Column({ type: "character varying" , length: 256 , nullable: true})
    password: string;

    @Column({ type: "bigint", nullable: true} )
    active: number;

    @Column({ type: "bigint", nullable: true})
    firstLogin: number;

    @ManyToOne(() => UserType, ut => ut.id)
    @JoinColumn({ name: "idUserType"})
    idUserType: UserType;
}
