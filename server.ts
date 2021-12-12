import { Client } from "pg";
import { config } from "dotenv";
import express from "express";
import cors from "cors";

config(); //Read .env file lines as though they were env vars.

//Call this script with the environment variable LOCAL set if you want to connect to a local db (i.e. without SSL)
//Do not set the environment variable LOCAL if you want to connect to a heroku DB.

//For the ssl property of the DB connection config, use a value of...
// false - when connecting to a local DB
// { rejectUnauthorized: false } - when connecting to a heroku DB
const herokuSSLSetting = { rejectUnauthorized: false }
const sslSetting = process.env.LOCAL ? false : herokuSSLSetting
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: sslSetting,
};

const app = express();

app.use(express.json()); //add body parser to each following route handler
app.use(cors()) //add CORS support to each following route handler

const client = new Client(dbConfig);
client.connect();

app.get("/", async (req, res) => {
  res.send('Connection OK')
});

app.get("/food", async (req,res) => {
  const result = await client.query(
    'select * from food_items'
  )
  res.json(result.rows)
});

app.get("/drink", async (req, res) => {
  const result = await client.query(
    'select * from drink_items'
  )
  res.json(result.rows)
});

app.get("/ingredients", async (req, res) => {
  const result = await client.query(
    'select * from ingredients'
  )
  res.json(result.rows)
});

app.get("/allergens", async (req, res) => {
  const result = await client.query(
    'select * from allergens'
  )
  res.json(result.rows)
});

//Start the server on the given port
const port = process.env.PORT;
if (!port) {
  throw 'Missing PORT environment variable.  Set it in .env file.';
}
app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
