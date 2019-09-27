import "reflect-metadata"
import express from "express"
import bodyParser from "body-parser";
import cors from 'cors'

import { userApp } from "./api/UserAPI";
import { projectApp } from "./api/ProjectAPI";
import { validatorApp } from "./api/ValidatorAPI";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())
app.use(userApp)
app.use(projectApp)
app.use(validatorApp)

const port = 3000;

app.get('/', (req, res) => {
  res.send('Running');
});

app.listen(port, err => {
  if (err) {
    return console.error(err);
  }
  return console.log(`server is listening on ${port}`);
});