import "reflect-metadata"
import express from "express"
import { asyncConnection } from "../connection";
import bodyParser from "body-parser";
import { UserController } from "../controller/UserController";
import { SessionController } from "../controller/SessionController";
import { ProjectController } from "../controller/ProjectController";
import { UserTypes } from "../entity/UserType";
import { Project } from "../entity/Project";

export let projectApp = express();
var jsonParser = bodyParser.json()
let sessionController = new SessionController
let projectController = new ProjectController
let userController= new UserController

//region requests to PROJECT
projectApp.post('/api/project/allByOwner',jsonParser, async (req, res, next) => {
    var token = req.headers['x-access-token']
    if (token) {
      let validToken = sessionController.validateToken(token.toString())
      if(validToken!=undefined){
        asyncConnection().then(async () => {
          let user = await userController.getUserByEmail(validToken.body.email)
          res.send(await projectController.getProjectsByOwner(user))
        })
      } else {
        res.status(400).send("Invalid Token")
      }
    } else{
      res.status(400).send("Pass some Token in header")
    }
});
  
projectApp.post('/api/project/insert',jsonParser, async (req, res, next) => {
    var token = req.headers['x-access-token']
    if (token) {
      let validToken = sessionController.validateToken(token.toString())
      if(validToken!=undefined){
        asyncConnection().then(async () => {    
          let user = await userController.getUserByEmail(validToken.body.email.toString())
          if(user.userType === UserTypes.COMPANY){
            let project = new Project
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
        res.status(400).send("Invalid Token")
      }
    } else{
      res.status(400).send("Pass some Token in header")
    }
});
  
projectApp.post('/api/project/skills',jsonParser, async (req, res, next) => {
    var token = req.headers['x-access-token']
    if (token) {
      let validToken = sessionController.validateToken(token.toString())
      if(validToken!=undefined){
        asyncConnection().then(async () => {    
          let user = await userController.getUserByEmail(validToken.body.email.toString())
          res.send(await projectController.getProjectsWithSkills(user))
        })
      } else {
        res.status(400).send("Invalid Token")
      }
    } else{
      res.status(400).send("Pass some Token in header")
    }
});

