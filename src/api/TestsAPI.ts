
import express from "express"

import { SessionController } from "../controller/SessionController";

import bodyParser from "body-parser";

const sessionController = new SessionController

export const testsApp = express();
testsApp.use(bodyParser.urlencoded({ extended: true }));
testsApp.use(bodyParser.json());

testsApp.post('/api/test/validToken', (req,res) =>{
  res.send(sessionController.validateToken(req.body.token))
})

testsApp.post('/api/test/hassPass', (req,res) =>{
  const converted =sessionController.hashPassword(req.body.password)
  res.send(converted)
});
