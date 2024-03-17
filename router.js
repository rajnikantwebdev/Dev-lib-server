import {
  getDatabase,
  set,
  ref,
  onValue,
  get,
  child,
  push,
} from "firebase/database";
import { firebase, pool } from "./server.js";

export const getUsers = (request, response) => {
  pool.query("SELECT * FROM youtubevideos ORDER BY id ASC", (err, res) => {
    if (err) {
      throw err;
    }
    response.status(200).json(res.rows);
  });
};

// api so that user can upload youtube video
export const writeUserData = (body) => {
  return new Promise(function (resolve, reject) {
    const { userId, title, vid_id } = body;

    // const dataObj = { youtubeVideoId, tags };
    // const jsonData = JSON.stringify(dataObj);
    // const yt_vid_data = [jsonData];
    // console.log("userId: ", userId);
    pool.query(
      "INSERT INTO ytvid (user_id, title, vid_id, created_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING *",
      [userId, title, vid_id],
      (error, result) => {
        if (error) {
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

export const addUserId = (body) => {
  return new Promise(function (resolve, reject) {
    const { userId } = body;
    pool.query(
      "INSERT INTO users (user_id) VALUES($1) RETURNING *",
      [userId],
      (error, result) => {
        if (error) {
          reject(error);
        }
        if (result && result.rows) {
          resolve(
            `A new userId has been added: ${JSON.stringify(result.rows[0])}`
          );
        } else {
          reject(new Error("No results found"));
        }
      }
    );
  });
};

export const increaseLikeCount = (id) => {
  return new Promise(function (resolve, reject) {
    pool.query(
      "UPDATE ytvid SET like_count = like_count + 1 WHERE vid_id = $1",
      [id],
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.rowCount);
        }
      }
    );
  });
};

export const getLikeCount = (vid_id) => {
  return new Promise(function (resolve, reject) {
    pool.query(
      "SELECT * FROM ytvid WHERE vid_id = $1",
      [vid_id],
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          if (result.rows.length > 0) {
            console.log("result: ", result.rows);
            resolve(result.rows[0].like_count);
          } else {
            resolve(0);
          }
        }
      }
    );
  });
};

// api to add user like, user dislike and neither like neither dislike
export const addUserLike = (body) => {
  return new Promise(function (resolve, reject) {
    const { userId, vid_id } = body;
    pool.query(
      "INSERT INTO user_likes (user_id, vid_id, isLike) VALUES ($1, $2, true)",
      [userId, vid_id],
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          console.log("user like added");
          resolve(result);
        }
      }
    );
  });
};
