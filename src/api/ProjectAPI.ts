import "reflect-metadata"
import express from "express"
import { asyncConnection } from "../connection";
import bodyParser from "body-parser";
import { UserController } from "../controller/UserController";
import { SessionController } from "../controller/SessionController";
import { ProjectController } from "../controller/ProjectController";
import { UserTypes } from "../entity/UserType";
import { Project } from "../entity/Project";

export const projectApp = express();
projectApp.use(bodyParser.urlencoded({ extended: true }));
projectApp.use(bodyParser.json());

const sessionController = new SessionController
const projectController = new ProjectController
const userController= new UserController

//region requests to PROJECT
projectApp.post('/api/project/allByOwner', async (req, res, next) => {
  const token = req.headers['x-access-token']
    if (token) {
      const validToken = sessionController.validateToken(token.toString())
      if(validToken!=undefined){
        asyncConnection().then(async () => {
          const user = await userController.getUserByEmail(validToken.body.email)
          res.send(await projectController.getProjectsWithSkills(user))
        })
      } else {
        res.status(401).send("Invalid Token")
      }
    } else{
      res.status(401).send("Pass some Token in header")
    }
});
  
projectApp.post('/api/project/all', async (req, res, next) => {
        asyncConnection().then(async () => {
          res.send(await projectController.getProjectsWithSkills(undefined))
        })
});


projectApp.post('/api/project/insert', async (req, res, next) => {
  const token = req.headers['x-access-token']
    if (token) {
      const validToken = sessionController.validateToken(token.toString())
      if(validToken!=undefined){
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
            res.status(403).send("You Have no access to create a project")
          }
        })
      } else {
        res.status(401).send("Invalid Token")
      }
    } else{
      res.status(401).send("Pass some Token in header")
    }
});
  
projectApp.post('/api/project/skills', async (req, res, next) => {
  const token = req.headers['x-access-token']
    if (token) {
      const validToken = sessionController.validateToken(token.toString())
      if(validToken!=undefined){
        asyncConnection().then(async () => {    
          const user = await userController.getUserByEmail(validToken.body.email.toString())
          res.send(await projectController.getProjectsWithSkills(user))
        })
      } else {
        res.status(401).send("Invalid Token")
      }
    } else{
      res.status(401).send("Pass some Token in header")
    }
});

