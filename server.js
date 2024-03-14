import express, { response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { initializeApp } from "firebase/app";
import { getAllData, getUsers, addUserId, writeUserData } from "./router.js";
import pkg from "pg";
import "dotenv/config";

const { Pool } = pkg;
const router = express.Router();
const app = express();

const fetch = (...args) =>
  import(node - fetch).then(({ default: fetch }) => fetch(...args));

// const corsOptions = {
//   origin: "http://localhost:3000",
//   credentials: true, //access-control-allow-credentials:true
//   optionSuccessStatus: 200,
// };
app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from http://localhost:3000
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Headers"
  );
  next();
});

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
// connectionString: process.env.POSTGRES_URL,
export const pool = new Pool({
  host: process.env.HOST,
  user: process.env.USER,
  database: process.env.DATABASE,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
});

export const firebase = initializeApp(firebaseConfig);

app.get("/", (req, res) => {
  res.send("hello world");
});

// app.get("/users", getUsers);

app.post("/adduser", (req, res) => {
  addUserId(req.body)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// app.post("/new-article", (req, res) => {
//   const { userId, name, youtubeLink, tags, uniqueId } = req.body;
//   writeUserData(userId, name, youtubeLink, tags, uniqueId);
//   res.send("Article added successfully.");
// });

app.post("/add-yt-vid", (req, res) => {
  writeUserData(req.body)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// app.get("/all-data", async (req, res) => {
//   try {
//     const data = await getAllData();
//     console.log(
//       "data: ",
//       data.map((d) => {
//         return d;
//       })
//     );
//     res.json(data);
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     res.status(500).send("Error fetching data");
//   }
// });

app.listen(process.env.PORT, function () {
  console.log("server Running on Port 4000");
});

export default app;
