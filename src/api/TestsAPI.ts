
import express from "express"

import { SessionController } from "../controller/SessionController";

import bodyParser from "body-parser";

var jsonParser = bodyParser.json()
let sessionController = new SessionController

export let testsApp = express();

testsApp.post('/api/test/validToken',jsonParser, (req,res) =>{
  res.send(sessionController.validateToken(req.body.token))
})

testsApp.post('/api/test/hassPass',jsonParser, (req,res) =>{
  let converted =sessionController.hashPassword(req.body.password)
  res.send(converted)
});
