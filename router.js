import { pool } from "./server.js";
import { v4 as uuidv4 } from "uuid";

// api to initiate video with 0 likes dislikes 0
export const videoLikesAndDislikes = (body, unique_id) => {
  return new Promise((resolve, reject) => {
    const { vid_id } = body;
    pool.query(
      "INSERT INTO video_like_and_dislike_count (vid_id, unique_id) VALUES ($1, $2) RETURNING *",
      [vid_id, unique_id],
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

// api so that user can upload youtube video
export const writeUserData = (body, unique_id) => {
  return new Promise(function (resolve, reject) {
    const { userId, title, vid_id, tags } = body;
    pool.query(
      "INSERT INTO ytvid (user_id, title, vid_id, created_at, tags, unique_id) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4, $5) RETURNING *",
      [userId, title, vid_id, tags, unique_id],
      (error, result) => {
        if (error) {
          console.log("error while adding user data to ytVid table", error);
          reject(error);
        }
        if (result && result.rows) {
          resolve({
            message: "A new youtube-video has been added",
            data: result.rows[0],
          });
        } else {
          reject(new Error("Data not added, try again later"));
        }
      }
    );
  });
};

//api to get all youtube videos
export const getAllVideoData = (page, limit) => {
  return new Promise(function (resolve, reject) {
    const offset = (page - 1) * limit;
    console.log("page: ", page);
    console.log("offset: ", offset);
    console.log("limit: ", limit);
    pool.query(
      "SELECT id, user_id, title, vid_id, created_at, unique_id, tags FROM ytvid LIMIT $1 OFFSET $2",
      [limit, offset],
      (error, result) => {
        if (error) {
          reject(error);
        }
        if (result && result.rows) {
          resolve({
            message: "data fetched",
            data: result.rows,
          });
        } else {
          reject(new Error("Data not founded, try again later"));
        }
      }
    );
  });
};
