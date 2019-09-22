
import express from "express"

import { SessionController } from "../controller/SessionController";

import bodyParser from "body-parser";

const jsonParser = bodyParser.json()
const sessionController = new SessionController

export const testsApp = express();

testsApp.post('/api/test/validToken',jsonParser, (req,res) =>{
  res.send(sessionController.validateToken(req.body.token))
})

testsApp.post('/api/test/hassPass',jsonParser, (req,res) =>{
  const converted =sessionController.hashPassword(req.body.password)
  res.send(converted)
});
