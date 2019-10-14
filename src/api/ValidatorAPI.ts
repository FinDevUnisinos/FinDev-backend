
import express from "express"

import { SessionController } from "../controller/SessionController";

import bodyParser from "body-parser";
import { Route } from "../config/route";

const sessionController = new SessionController
const route = new Route

export const validatorApp = express();
validatorApp.use(bodyParser.urlencoded({ extended: true }));
validatorApp.use(bodyParser.json());

validatorApp.post(route.getValidatorRoute()+'/validToken', (req,res) =>{
    res.send(sessionController.validateToken(req.body.token))
})

validatorApp.post(route.getValidatorRoute()+'/hashPass', (req,res) =>{
    const converted =sessionController.hashPassword(req.body.password)
    res.send(converted)
});
