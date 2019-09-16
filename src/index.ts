import express from "express"
import dotenv from 'dotenv'
dotenv.config();

import { config } from './config'

const app = express();
const port = 3000;

const pg = require('pg');
const pool = new pg.Pool(config);

pool.query(`SELECT * FROM findev.\"User\"`, (err, res) => {
  console.log(err, res);
  pool.end();
});

app.get('/', (req, res) => {
  res.send('Running');
});

app.listen(port, err => {
  if (err) {
    return console.error(err);
  }
  return console.log(`server is listening on ${port}`);
});