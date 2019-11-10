import { getConnection, createQueryBuilder, UpdateResult, InsertResult, DeleteResult } from "typeorm";
import { Project } from "../entity/Project";
import { User } from "../entity/User";
import { SkillProject } from "../entity/SkillProject";
import { SkillController } from "./SkillController";
import { Validator } from "../config/validator";
import { UserInterestProject } from "../entity/UserInterestProject";
import { UserController } from "./UserController";

export class ProjectController {
    addProject(project: Project): Promise<InsertResult> {
        return getConnection()
            .createQueryBuilder()
            .insert()
            .into(Project)
            .values(project)
            .execute();
    }

    async addSkillOnProject(projectId: number, skillId: number, level: number): Promise<InsertResult> {
        let skillController = new SkillController
        let projSkill = new SkillProject
        let validator = new Validator
        projSkill.level = validator.validateLevelSkill(level)
        projSkill.project = await this.getProjectById(projectId)
        projSkill.skill = await skillController.getSkillById(skillId)

        return getConnection()
            .createQueryBuilder()
            .insert()
            .into(SkillProject)
            .values(projSkill)
            .execute();
    }

    deleteSkillFromProject(projectId: number, skillId: number): Promise<DeleteResult>  {
        return getConnection()
            .createQueryBuilder()
            .delete()
            .from(SkillProject)
            .where("\"projectId\" = :projectId", { projectId: projectId })
            .andWhere("\"skillId\" = :skillId", { skillId: skillId })
            .execute();
    }

    addWorkerOnProject(projectId: number, userId: number): Promise<void>  {
        return getConnection()
            .createQueryBuilder()
            .relation(Project, "workers")
            .of(projectId)
            .add(userId);
    }

    async addInterestOnProject(projectId: number, userId: number, positive: boolean): Promise<void> {

        const userController = new UserController
        let userInterestProject = new UserInterestProject

        userInterestProject.positive = positive
        userInterestProject.project = await this.getProjectById(projectId)
        userInterestProject.user = await userController.getUserById(userId)

        getConnection()
            .createQueryBuilder()
            .insert()
            .into(UserInterestProject)
            .values(userInterestProject)
            .execute();
    }

    getProjects(): Promise<Project[]> {
        return getConnection().manager.find(Project);
    }

    getProjectsWithSkillsCompany(user: User): Promise<Project[]> {
        return createQueryBuilder(Project)
            .leftJoinAndSelect("Project.skillsProject", "skillProject")
            .leftJoinAndSelect("skillProject.skill", "skill")
            .where({ ownerUser: user.id })
            .getMany();
    }

    getProjectsWithSkillsEmployee(user: User): Promise<Project[]> {
        let interestedProjs = createQueryBuilder()
            .select("\"p2\".\"id\"")
            .from("Project", "p2")
            .innerJoin("p2.interestsProject", "uip2")
            .innerJoin("uip2.user", "u2")
            .where("u2.id = :identifier");

        return createQueryBuilder(Project)
            .leftJoinAndSelect("Project.skillsProject", "skillProject")
            .leftJoinAndSelect("skillProject.skill", "skill")
            .where({ closed: false })
            .andWhere("Project.id NOT IN (" + interestedProjs.getSql() + ")", { identifier: user.id })
            .getMany();
    }

    getWorkersOfProject(idExt: number): Promise<Project[]> {
        return getConnection()
            .getRepository(Project)
            .createQueryBuilder("p")
            .leftJoinAndSelect("p.workers", "user")
            .where("p.id = :id", { id: idExt })
            .getMany();
    }

    getInterestsOfAllProjects(user: User): Promise<Project[]> {
        return createQueryBuilder(Project)
            .innerJoinAndSelect("Project.interestsProject", "uip")

            .leftJoinAndSelect("Project.skillsProject", "sp")
            .leftJoinAndSelect("sp.skill", "sps")

            .leftJoinAndSelect("uip.user", "u")
            .leftJoinAndSelect("u.skillsUser", "su")
            .leftJoinAndSelect("su.skill", "sus")

            .where({ ownerUser: user.id })
            .andWhere("uip.positive=true")
            .getMany();
    }

    getProjectById(idExt: number): Promise<Project> {
        return getConnection()
            .getRepository(Project)
            .createQueryBuilder("p")
            .where("p.id = :id", { id: idExt })
            .getOne();
    }

    getProjectsByOwner(user: User): Promise<Project[]> {
        return getConnection()
            .getRepository(Project)
            .find({ ownerUser: user })
    }

    updateProjectToClosed(user: User, idExt: number): Promise<UpdateResult> {
        return getConnection().getRepository(Project).update(
            { id: idExt, ownerUser: user },
            { closed: true },
        )
    }

}