import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { initializeApp } from "firebase/app";
import { getAllData, getUsers, addUserId } from "./router.js";
import pkg from "pg";
import "dotenv/config";

const { Pool } = pkg;
const router = express.Router();
const app = express();
const fetch = (...args) =>
  import(node - fetch).then(({ default: fetch }) => fetch(...args));

const firebaseConfig = {
  apiKey: "AIzaSyDBt60YVWPEvQGMvOTCfyJAuJY0_hU4XRA",
  authDomain: "devlib-c6572.firebaseapp.com",
  databaseURL:
    "https://devlib-c6572-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "devlib-c6572",
  storageBucket: "devlib-c6572.appspot.com",
  messagingSenderId: "553953347527",
  appId: "1:553953347527:web:2ebde7a35ff5917e2cbbe2",
  measurementId: "G-CM76FGV328",
};

export const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export const firebase = initializeApp(firebaseConfig);

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("hello world");
});

app.get("/users", getUsers);

app.post("/adduser", addUserId);

// app.post("/new-article", (req, res) => {
//   const { userId, name, youtubeLink, tags, uniqueId } = req.body;
//   writeUserData(userId, name, youtubeLink, tags, uniqueId);
//   res.send("Article added successfully.");
// });

app.get("/all-data", async (req, res) => {
  try {
    const data = await getAllData();
    console.log(
      "data: ",
      data.map((d) => {
        return d;
      })
    );
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data");
  }
});

app.listen(process.env.PORT, function () {
  console.log("Cors server Running on Port 4000");
});

export default app;
