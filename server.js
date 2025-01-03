import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
// import client from "./redisConfig.js";

import {
  getAllVideoData,
  addVideo,
  fetchPopularVideos,
  fetchPopularVideoWithQuery,
} from "./router.js";
import {
  addVideoIdInSavedPost,
  checkIfVideoIdExists,
  removeVideoIdFromSavedList,
  getAllSavedVideos,
} from "./savedVideosRouter.js";

import { addArticle, getAllArticles } from "./articlesRouter.js";

import {
  addUserLike,
  removeUserLikedVideo,
  getAllLikedVideos,
  checkIfLikedVideoExists,
  incrementLikeCount,
  decrementLikeCount,
  getAllLikesFromVideos,
} from "./likeVideosRouter.js";

import {
  checkUserExistence,
  getUserDetailsForUserPage,
  searchUserValues,
  addUserIdToUsersTable,
  createUserBukcet,
  getUserProfilePicture,
  getallUserDataFromDatabase,
  updateUser,
  updateUserImageUrl,
} from "./allUserRelatedTransactions.js";

import {
  addComment,
  getAllComments,
  deleteComment,
  updateComment,
} from "./commentRoutes.js";
import {
  userPostCount,
  checkUserFollow,
  followUser,
  unfollowUser,
  userFollowerCount
} from "./userSearchRelatedTransactions.js";

import { handlePostPromise } from "./skeltonFunctions.js";
import pkg from "pg";
import "dotenv/config";

const { Pool } = pkg;
const app = express();

const fetch = (...args) =>
  import(node - fetch).then(({ default: fetch }) => fetch(...args));

app.use(
  cors({
    origin: ["http://localhost:3000", "https://devlib-psi.vercel.app"], // Allow requests from http://localhost:3000
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

export const pool = new Pool({
  connectionString:
    "postgres://default:d8vZwTjxBAq5@ep-tight-credit-a12mr80v-pooler.ap-southeast-1.aws.neon.tech:5432/verceldb?sslmode=require",
});

app.get("/", (req, res) => {
  res.send("hello world");
});

app.post("/api/addNewArticle", async (req, res) => {
  try {
    const response = await addArticle(req.body);
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
    console.log("errors while getting all liked videos: ", error);
  }
});

app.get("/api/updatedLikeVideos", async (req, res) => {
  const lastTimeStamp = req.body;
  try {
    const response = await getUpdateLikedVideo(lastTimeStamp);
    res.status(200).json({ data: response });
  } catch (error) {
    console.log("error during updating likes: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// get req for all articles
app.get("/api/getArticles", async (req, res) => {
  try {
    const response = await getAllArticles();
    res.status(200).json({ data: response });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message:
          "An error occurred while retrieving articles. Please try again later.",
      },
    });
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
    // console.log(req.body);
    const ifVideoIdExistsResponse = await checkIfVideoIdExists(req.body);
    res.status(200).json({ data: ifVideoIdExistsResponse });
  } catch (error) {
    // console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/removeVideoFromSavedVideos", async (req, res) => {
  try {
    // console.log(req.body);
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
    console.log("error while getting all saved videos: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// add youtube video in the database
app.post("/addVideo", async (req, res) => {
  try {
    const { success, id } = await addVideo(req.body);
    if (success) {
      res.status(200).send({ success: true, id });
    } else {
      res.status(500).send({ success: false, message: "Failed to add video" });
    }
  } catch (error) {
    console.log("error while adding video: ", error);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
});

// fetch all popular videos
app.get("/api/fetch/popularVideos", async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    // console.log(typeof page);
    const limit = 5;
    const response = await fetchPopularVideos(page, limit);
    res.status(200).json({ data: response.data, message: response.message });
  } catch (error) {
    console.log("popular videos error: ", error);
    res
      .status(500)
      .json({ message: "error while fetching popular videos", success: false });
  }
});

// get all the youtube video from the database
app.get("/api/fetch/youtubeVideos", async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const query = req.query.q;
    const limit = 5;
    // const cachedData = await client.get(`cachedData_page_${page}`);

    const cachedData = false;
    if (cachedData) {
      res
        .status(200)
        .json({ data: JSON.parse(cachedData), message: "cached data" });
    } else {
      const videoResponse = await getAllVideoData(page, limit, query);
      res
        .status(200)
        .json({ data: videoResponse.data, message: videoResponse.message });
    }
    // console.log("response: ", response);
  } catch (error) {
    console.log("error while fetching videos: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//
//

app.get("/api/fetch/videos/likesAndDislikes", async (req, res) => {
  try {
    const likesAndDislikesResponse = await getAllLikesFromVideos();
    res.status(200).json({ data: likesAndDislikesResponse });
  } catch (error) {
    console.log("error while getting all likes: ", error);
    res.status(500).json({ message: "error while fetching likes" });
  }
});

app.post("/api/getAllLikedVideos", async (req, res) => {
  try {
    // console.log(req.body);
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
    console.log("error while removing user likes: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/addLike", async (req, res) => {
  try {
    const addLikeResponse = await addUserLike(req.body);
    res.status(200).json({ data: addLikeResponse });
  } catch (error) {
    console.log("error while adding like:", error);
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
    console.log("error while incrementing user likes: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/decrementLikeCount", async (req, res) => {
  try {
    const decrementLikeCountResponse = await decrementLikeCount(req.body);
    res.status(200).json({ data: decrementLikeCountResponse });
  } catch (error) {
    console.log("error while decrementing user Likes: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/get-userDeta", async (req, res) => {
  try {
    const userId = req.query.user_id;
    // console.log(userId);
    getUserDetailsForUserPage(userId).then((response) => {
      console.log("response: ", response);
      res.status(200).send(response);
    });
  } catch (error) {
    console.log("error while getting user data: ", error);
    res.status(500).json({ error: error });
  }
});

app.listen(process.env.PORT, function () {
  console.log("server Running on Port 4000");
});

export default app;

//Number of API's Created By me

//checks if user exists in the db
app.post("/checkUserExist", (req, res) => {
  // console.log(req.body);
  handlePostPromise(checkUserExistence(req.body), res);
});

//after checking if the user does not exist it adds it to the db
app.post("/adduser", (req, res) => {
  handlePostPromise(addUserIdToUsersTable(req.body), res);
});

//if the user is created the user will need a video Bucket so here he will have its video bucket created
app.post("/addUserVideoBucket", (req, res) => {
  // console.log(req.body);
  handlePostPromise(createUserBukcet(req.body), res);
});

//this is made for one user to search other fellow users on devlib
app.get("/searchUsers", (req, res) => {
  console.log(req.query.searchedWords);
  handlePostPromise(searchUserValues(req.query.searchedWords), res);
});

//this is created for users to get their profile picture from their account.
app.get("/get-user-profilepicture", (req, res) => {
  console.log(req.query.user_id);
  handlePostPromise(getUserProfilePicture(req.query.user_id), res);
});

//this is to update user profile picture if user is unhappy or not satisfied by his/her photo he can update it
app.post("/update-profile-picture", (req, res) => {
  handlePostPromise(updateUserImageUrl(req.body), res);
});

app.post("/addUserId", (req, res) => {
  handlePostPromise(addUserIdToUsersTable(req.body), res);
});

//this is to get user data from the database so we they can see each others details
app.get("/getUserDataFromDatabase", (req, res) => {
  console.log(req.query.user_id);
  handlePostPromise(getallUserDataFromDatabase(req.query.user_id), res);
});

//this is made to update user's personal profile according to their prefrence
app.post("/updateuser", (req, res) => {
  handlePostPromise(updateUser(req.body.user), res);
});

app.get("/getUserDataFromDatabase", (req, res) => {
  console.log(req.query.user_id);
  handlePostPromise(getallUserDataFromDatabase(req.query.user_id), res);
});

// api to add comment
app.post("/api/addComment", (req, res) => {
  handlePostPromise(addComment(req.body), res);
});

app.post("/api/getAllComments", (req, res) => {
  handlePostPromise(getAllComments(req.body), res);
});
app.post("/api/user/post-count", (req, res) => {
  handlePostPromise(userPostCount(req), res);
});

app.get("/api/before_follow", (req, res) => {
  console.log("I got the check hit");
  handlePostPromise(checkUserFollow(req), res);
});

app.get("/api/user/on_follow", (req, res) => {
  console.log("I got the follow Hit");
  handlePostPromise(followUser(req), res);
});

app.get("/api/user/on_un_follow", (req, res) => {
  console.log("I got the Unfollow Hit");
  handlePostPromise(unfollowUser(req), res);
});

app.get("/api/user/get_follower_count", (req, res) => {
  console.log("I got the follower Count Hit");
  // handlePostPromise(unfollowUser(req), res);
  handlePostPromise(userFollowerCount(req),res)
});

// app.get("api/user/followerCount",(req,res)=>{
//  
//   handlePostPromise(userFollowerCount(req),res)
// })



app.get("api/user/getfollowingCount",(req,res)=>{
  console.log("I got the following Count Hit");
  handlePostPromise(followingCount(res),res)
})





app.post("/api/comment/delete", async (req, res) => {
  try {
    const response = await deleteComment(req.body);
    res.status(200).json({ response });
  } catch (error) {
    console.log("error while deleting comment", error);
    res.status(503).json({ message: "Server is unable to fulfill request" });
  }
});

app.post("/api/comment/update", async (req, res) => {
  try {
    const response = await updateComment(req.body);
    res.status(200).json({ response });
  } catch (error) {
    res
      .status(503)
      .json({ message: "Server is unable to update comment at the moment" });
  }
});

app.get("/api/fetch/popularVideoWithQuery", async (req, res) => {
  try {
    const query = req.query.q;
    const page = parseInt(req.query.page);
    const limit = 5;
    const response = await fetchPopularVideoWithQuery(query, page, limit);
    res.status(200).json({ data: response.data, message: response.message });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});
