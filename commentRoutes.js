import { pool } from "./server.js";

export const addComment = (body) => {
  return new Promise((resolve, reject) => {
    const { userId, vid_id, comment } = body;
    console.log("user-id: ", userId, "vid_id: ", vid_id, "comment: ", comment);
    pool.query(
      "INSERT INTO comment_bucket (user_id, vid_id, comment) VALUES ($1, $2, $3)",
      [userId, vid_id, comment],
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
      "SELECT id, comment_bucket.user_id, comment, name, profilepicture FROM comment_bucket INNER JOIN users ON comment_bucket.user_id = users.user_id WHERE vid_id = $1",
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

export const deleteComment = (body) => {
  return new Promise((resolve, reject) => {
    const { id } = body;
    pool.query(
      "DELETE FROM comment_bucket WHERE id = $1",
      [id],
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({ message: "comment deleted", response: result });
        }
      }
    );
  });
};

export const updateComment = (body) => {
  return new Promise((resolve, reject) => {
    const { comment, id } = body;
    pool.query(
      "UPDATE comment_bucket SET comment = $1 WHERE id = $2",
      [comment, id],
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
