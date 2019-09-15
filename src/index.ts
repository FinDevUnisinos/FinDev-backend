const dotenv = require('dotenv');
dotenv.config();

const express = require("express");
const app = express();
const port = 3000;

const pg = require('pg');
const pool = new pg.Pool({
  user:     process.env.user,
  host:     process.env.host,
  database: process.env.database,
  password: process.env.password,
  port:     process.env.port,
  scheme:   process.env.scheme
});

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