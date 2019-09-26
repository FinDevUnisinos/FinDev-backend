
import express from "express"

import { SessionController } from "../controller/SessionController";

import bodyParser from "body-parser";

const sessionController = new SessionController

export const validatorApp = express();
validatorApp.use(bodyParser.urlencoded({ extended: true }));
validatorApp.use(bodyParser.json());

validatorApp.post('/api/validator/validToken', (req,res) =>{
  res.send(sessionController.validateToken(req.body.token))
})

validatorApp.post('/api/validator/hassPass', (req,res) =>{
  const converted =sessionController.hashPassword(req.body.password)
  res.send(converted)
});
