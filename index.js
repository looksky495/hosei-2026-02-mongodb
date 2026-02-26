import path from "node:path";
import express from "express";
import { MongoClient } from "mongodb";
import { insertUser } from "./user";

const client = new MongoClient("mongodb://localhost:27017");
const app = express();

async function main(){
  await client.connect();

  const db = client.db("my-app");

  app.set("view engine", "ejs");
  app.use("/static", express.static(path.join(import.meta.dirname, "public")));

  app.get("/", async (req, res) => {
    const users = await db.collection("user").find().toArray();
    const names = users.map(user => user.name);
    res.render(path.resolve(import.meta.dirname, "views/index.ejs"), { users: names });
  });

  app.post("/api/user", express.json(), async (req, res) => {
    const name = req.body.name;
    const result = await insertUser(db, name);
    res.status(result.status).send(result.message);
  });

  app.listen(3000, () => {
    console.log("start listening");
  });
}

main();
