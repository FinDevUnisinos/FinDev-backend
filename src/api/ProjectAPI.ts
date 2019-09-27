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
const userController= new UserController
const route = new Route

//region requests to PROJECT
projectApp.post(route.getProjectRoute()+'/allByOwner', authApp, async (req, res, next) => {
    const validToken = sessionController.validateToken(req.headers['x-access-token'].toString())
    asyncConnection().then(async () => {
    const user = await userController.getUserByEmail(validToken.body.email)
    res.send(await projectController.getProjectsWithSkills(user))
    })
});
  
projectApp.post(route.getProjectRoute()+'/all', authApp, async (req, res, next) => {
    asyncConnection().then(async () => {
    res.send(await projectController.getProjectsWithSkills(undefined))
    })
});


projectApp.post(route.getProjectRoute()+'/insert', authApp, async (req, res, next) => {
    const validToken = sessionController.validateToken(req.headers['x-access-token'].toString())
    asyncConnection().then(async () => {    
    const user = await userController.getUserByEmail(validToken.body.email.toString())
    if(user.userType === UserTypes.COMPANY){
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
  
projectApp.post(route.getProjectRoute()+'/skills', authApp, async (req, res, next) => {
    const validToken = sessionController.validateToken(req.headers['x-access-token'].toString())
    asyncConnection().then(async () => {    
        const user = await userController.getUserByEmail(validToken.body.email.toString())
        res.send(await projectController.getProjectsWithSkills(user))
    })
});

