import express, { response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { initializeApp } from "firebase/app";
import {
  addVideoId,
  getAllVideoData,
  addUserId,
  writeUserData,
  getLikeCount,
  addUserLike,
  updateLikesInYtvidTable,
  getAllLikedVideos,
  getUpdateLikedVideo,
  isLiked,
} from "./router.js";
import pkg from "pg";
import "dotenv/config";

const { Pool } = pkg;
const router = express.Router();
const app = express();

const fetch = (...args) =>
  import(node - fetch).then(({ default: fetch }) => fetch(...args));

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

// const firebaseConfig = {
//   apiKey: "AIzaSyDBt60YVWPEvQGMvOTCfyJAuJY0_hU4XRA",
//   authDomain: "devlib-c6572.firebaseapp.com",
//   databaseURL:
//     "https://devlib-c6572-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "devlib-c6572",
//   storageBucket: "devlib-c6572.appspot.com",
//   messagingSenderId: "553953347527",
//   appId: "1:553953347527:web:2ebde7a35ff5917e2cbbe2",
//   measurementId: "G-CM76FGV328",
// };
// connectionString: process.env.POSTGRES_URL,
export const pool = new Pool({
  host: process.env.HOST,
  user: process.env.USER,
  database: process.env.DATABASE,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
});

// export const firebase = initializeApp(firebaseConfig);

app.get("/", (req, res) => {
  res.send("hello world");
});

app.get("/api/likedVideo", async (req, res) => {
  try {
    const response = await getAllLikedVideos();
    res.status(200).send({ data: response });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
});

app.get("/api/updatedLikeVideos", async (req, res) => {
  const lastTimeStamp = req.body;
  try {
    const response = await getUpdateLikedVideo(lastTimeStamp);
    res.status(200).send({ data: response });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
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

// add youtube video in the database
app.post("/add-yt-vid", (req, res) => {
  writeUserData(req.body)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// get all the youtube video from the database
app.get("/get-yt-vid", (req, res) => {
  getAllVideoData()
    .then((response) => {
      console.log("response: ", response.data);
      res.status(200).send(response.data);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.post("/api/addVideoId", async (req, res) => {
  try {
    const response = await addVideoId(req.body);
    res.status(200).send({ data: response });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.post("/get-like-count", async (req, res) => {
  try {
    const vidId = req.body.video_id;
    const rowCount = await getLikeCount(vidId);
    // console.log(rowCount);
    res.status(200).send({ rowCount: rowCount });
  } catch (error) {
    console.log("Error updating like count: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/updateUserLikes", async (req, res) => {
  try {
    const response = await addUserLike(req.body);
    res.status(200).send({ data: response });
  } catch (error) {
    console.log("Error adding like, ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/addLike", async (req, res) => {
  try {
    const response = await updateLikesInYtvidTable(req.body);
    res.status(200).send({ data: response });
  } catch (error) {
    console.log("Error adding like, ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/checkLike", async (req, res) => {
  try {
    const response = await isLiked(req.body);
    res.status(200).send({ data: response });
  } catch (error) {
    console.log("unable to get check like status due to: " + error);
  }
});

app.listen(process.env.PORT, function () {
  console.log("server Running on Port 4000");
});

export default app;
