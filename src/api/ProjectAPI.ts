import "reflect-metadata"
import express from "express"
import { asyncConnection } from "../connection";
import bodyParser from "body-parser";
import { UserController } from "../controller/UserController";
import { SessionController } from "../controller/SessionController";
import { ProjectController } from "../controller/ProjectController";
import { UserTypes } from "../entity/UserType";
import { Project } from "../entity/Project";
import { Route } from "../config/route";
import { authApp } from "./AuthAPI";

export const projectApp = express();
projectApp.use(bodyParser.urlencoded({ extended: true }));
projectApp.use(bodyParser.json());

const sessionController = new SessionController
const projectController = new ProjectController
const userController = new UserController
const route = new Route

//region requests to PROJECT
projectApp.post(route.getProjectRoute() + '/allByOwner', authApp, async (req, res, next) => {
    
    const validToken = sessionController.validateToken(req.headers['x-access-token'].toString())
    
    asyncConnection().then(async () => {
    
        const user = await userController.getUserByEmail(validToken.body.email)
        res.send(await projectController.getProjectsWithSkills(user))
    
    })
});

projectApp.post(route.getProjectRoute() + '/all', authApp, async (req, res, next) => {
    asyncConnection().then(async () => {
        res.send(await projectController.getProjectsWithSkills(undefined))
    })
});


projectApp.post(route.getProjectRoute() + '/insert', authApp, async (req, res, next) => {
    
    const validToken = sessionController.validateToken(req.headers['x-access-token'].toString())
    
    asyncConnection().then(async () => {
        
        const user = await userController.getUserByEmail(validToken.body.email.toString())
        
        if (user.userType === UserTypes.COMPANY) {
            
            const project = new Project
            project.newProject(
                req.body.name,
                req.body.description,
                req.body.closed,
                user
            )

            await projectController.addProject(project)
            res.send("Project successfully created")

        } else {
            res.status(403).send("You cannot create a project since you aren't a company")
        }

    })
});

projectApp.post(route.getProjectWorkersRoute() + '/insert', authApp, async (req, res, next) => {
    
    const validToken = sessionController.validateToken(req.headers['x-access-token'].toString())
    
    asyncConnection().then(async () => {
        
        const user = await userController.getUserByEmail(validToken.body.email.toString())
        
        if (user.userType === UserTypes.COMPANY) {
            
            const projectId = Number.parseInt(req.body.projectId)
            const userId = Number.parseInt(req.body.userId)
            
            await projectController.addWorkerOnProject(projectId, userId)
            res.send("Worker successfully inserted on Project")

        } else {
            res.status(403).send("You cannot insert a worker on a project since you aren't a company")
        }
    })
});

projectApp.post(route.getProjectInterestsRoute() + '/insert', authApp, async (req, res, next) => {
    
    const validToken = sessionController.validateToken(req.headers['x-access-token'].toString())
    
    asyncConnection().then(async () => {
    
        const user = await userController.getUserByEmail(validToken.body.email.toString())
    
        if (user.userType === UserTypes.EMPLOYEE) {
            
            const projectId = Number.parseInt(req.body.projectId)
            const userId = user.id
            
            await projectController.addInterestOnProject(projectId, userId)
            res.send("Interest successfully inserted on Project")

        } else {
            res.status(403).send("You cannot insert a interest on a project since you aren't an employee")
        }
    })
});

projectApp.post(route.getProjectSkillsRoute() + '/insert', authApp, async (req, res, next) => {
    
    const validToken = sessionController.validateToken(req.headers['x-access-token'].toString())
    
    asyncConnection().then(async () => {
    
        const user = await userController.getUserByEmail(validToken.body.email.toString())
    
        if (user.userType === UserTypes.COMPANY) {
            
            const projectId = Number.parseInt(req.body.projectId)
            const skillId = Number.parseInt(req.body.skillId)
            const level = Number.parseInt(req.body.level)

            await projectController.addSkillOnProject(projectId, skillId, level)
            res.send("Skill successfully inserted on Project")

        } else {
            res.status(403).send("You cannot insert a skill on a project since you aren't a company")
        }
    
    })
});

projectApp.post(route.getProjectSkillsRoute() + '/all/company', authApp, async (req, res, next) => {
    
    const validToken = sessionController.validateToken(req.headers['x-access-token'].toString())
    
    asyncConnection().then(async () => {
        
        const user = await userController.getUserByEmail(validToken.body.email.toString())
        res.send(await projectController.getProjectsWithSkills(user))
        
    })
});

projectApp.post(route.getProjectSkillsRoute() + '/all/employee', authApp, async (req, res, next) => {
    asyncConnection().then(async () => {
        res.send(await projectController.getProjectsWithSkills(undefined))
    })
});

