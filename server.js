import express, { response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { getAllVideoData, writeUserData } from "./router.js";
import {
  addVideoIdInSavedPost,
  checkIfVideoIdExists,
  removeVideoIdFromSavedList,
  getAllSavedVideos,
} from "./savedVideosRouter.js";
import { addArticle } from "./articlesRouter.js";

import {
  addUserLike,
  removeUserLikedVideo,
  getAllLikedVideos,
  checkIfLikedVideoExists,
  incrementLikeCount,
  decrementLikeCount,
} from "./likeVideosRouter.js";

import {
  checkUserExistence,
  getUserDetailsForUserPage,
  searchUserValues,
  addUserIdToUsersTable,
  createUserBukcet,
} from "./allUserRelatedTransactions.js";

import { handlePostPromise } from "./skeltonFunctions.js";
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

export const pool = new Pool({
  connectionString:
    "postgres://default:d8vZwTjxBAq5@ep-tight-credit-a12mr80v-pooler.ap-southeast-1.aws.neon.tech:5432/verceldb?sslmode=require",
});

app.get("/", (req, res) => {
  res.send("hello world");
});

app.post("/api/addNewArticle", async (req, res) => {
  try {
    const response = addArticle(req.body);
    res.status(200).json({ data: response });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
    console.log("error while adding new article in bucket: ", error);
  }
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
    res.status(200).json({ data: response });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/updateSavedPost", async (req, res) => {
  try {
    const response = await addVideoIdInSavedPost(req.body);
    res.status(200).send({ data: response });
  } catch (error) {
    // console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/checkIfVideoIdExists", async (req, res) => {
  try {
    console.log(req.body);
    const ifVideoIdExistsResponse = await checkIfVideoIdExists(req.body);
    res.status(200).json({ data: ifVideoIdExistsResponse });
  } catch (error) {
    // console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/removeVideoFromSavedVideos", async (req, res) => {
  try {
    console.log(req.body);
    const removeVideoResponse = await removeVideoIdFromSavedList(req.body);
    res.status(200).json({ data: removeVideoResponse });
  } catch (error) {
    // console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/getAllSavedVideos", async (req, res) => {
  try {
    const getAllSavedVideosResponse = await getAllSavedVideos(req.body);
    res.status(200).json({ data: getAllSavedVideosResponse });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
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

app.post("/api/getAllLikedVideos", async (req, res) => {
  try {
    console.log(req.body);
    const getAllLikedVideosResponse = await getAllLikedVideos(req.body);
    res.status(200).json({ data: getAllLikedVideosResponse });
  } catch (error) {
    console.log("Error updating like count: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/removeUserLikedVideo", async (req, res) => {
  try {
    const removeUserLikedVideoResponse = await removeUserLikedVideo(req.body);
    res.status(200).json({ data: removeUserLikedVideoResponse });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/addLike", async (req, res) => {
  try {
    const addLikeResponse = await addUserLike(req.body);
    res.status(200).json({ data: addLikeResponse });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/checkIfLikeExists", async (req, res) => {
  try {
    const checkIfLikedVideoExistsResponse = await checkIfLikedVideoExists(
      req.body
    );
    res.status(200).send({ data: checkIfLikedVideoExistsResponse });
  } catch (error) {
    console.log("unable to get check like status due to: " + error);
  }
});

app.post("/api/incrementLikeCount", async (req, res) => {
  try {
    const incrementLikeCountResponse = await incrementLikeCount(req.body);
    res.status(200).json({ data: incrementLikeCountResponse });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/decrementLikeCount", async (req, res) => {
  try {
    const decrementLikeCountResponse = await decrementLikeCount(req.body);
    res.status(200).json({ data: decrementLikeCountResponse });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/get-userDeta", async (req, res) => {
  try {
    const userId = req.query.user_id;
    console.log(userId);
    getUserDetailsForUserPage(userId).then((response) => {
      console.log("response: ", response);
      res.status(200).send(response);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

app.get("/get-userDeta", async (req, res) => {
  try {
    const userId = req.query.user_id;
    console.log(userId);
    getUserDetailsForUserPage(userId).then((response) => {
      console.log("response: ", response);
      res.status(200).send(response);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

app.listen(process.env.PORT, function () {
  console.log("server Running on Port 4000");
});

export default app;

app.post("/adduser", (req, res) => {
  handlePostPromise(addUserDetails(req.body), res);
});

app.post("/checkUserExist", (req, res) => {
  console.log(req.body);
  handlePostPromise(checkUserExistence(req.body), res);
});

app.post("/addUserVideoBucket", (req, res) => {
  console.log(req.body);
  handlePostPromise(createUserBukcet(req.body), res);
});

app.get("/searchUsers", (req, res) => {
  console.log(req.query.searchedWords);
  handlePostPromise(searchUserValues(req.query.searchedWords), res);
});

app.post("/adduser", (req, res) => {
  handlePostPromise(addUserIdToUsersTable(req.body), res);
});
