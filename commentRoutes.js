import { pool } from "./server.js";
import { v4 as uuidv4 } from "uuid";

export const addComment = (body) => {
  return new Promise((resolve, reject) => {
    const { userId, vid_id, comment } = body;
    const unique_id = uuidv4();
    pool.query(
      "INSERT INTO comment_bucket (user_id, unique_id, vid_id, comment) VALUES ($1, $2, $3, $4)",
      [userId, unique_id, vid_id, comment],
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

export const getAllComments = (body) => {
  return new Promise((resolve, reject) => {
    const { vid_id } = body;
    pool.query(
      "SELECT comment, name, profilepicture FROM comment_bucket INNER JOIN users ON comment_bucket.user_id = users.user_id WHERE vid_id = $1",
      [vid_id],
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.rows);
        }
      }
    );
  });
};
