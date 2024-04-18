import { pool } from "./server.js";
import { v4 as uuidv4 } from "uuid";

// api so that user can upload youtube video
export const writeUserData = (body) => {
  return new Promise(function (resolve, reject) {
    const { userId, title, vid_id, tags } = body;
    const uuid = uuidv4();
    pool.query(
      "INSERT INTO ytvid (user_id, title, vid_id, created_at, tags, unique_id) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4, $5) RETURNING *",
      [userId, title, vid_id, tags, uuid],
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
export const getAllVideoData = () => {
  return new Promise(function (resolve, reject) {
    pool.query("SELECT * FROM ytvid", (error, result) => {
      if (error) {
        reject(error);
      }
      if (result && result.rows) {
        resolve({
          message: "data founded",
          data: result.rows,
        });
      } else {
        reject(new Error("Data not founded, try again later"));
      }
    });
  });
};
