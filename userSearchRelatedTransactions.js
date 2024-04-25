import { pool } from "./server.js";

export const userPostCount = (request) => {
  return new Promise((res, rej) => {
    // res("Hey accepte")
    rej(new Error("Sorry we are unable to conduct the res"));
  });
};

export const checkUserFollow = (req) => {
  const { follow_user, followed_user } = req.query;
  console.log(follow_user, followed_user);
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM followers WHERE follower_id = $1 AND followed_id = $2",
      [follow_user, followed_user],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          // If the result contains rows, it means the follow_user has followed the followed_user
          const followed = result.rows.length > 0;
          resolve(followed);
        }
      }
    );
  });
};

export const followUser = (req) => {
  const { follower_id, followed_id } = req.query;
  console.log(follower_id, followed_id);
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO followers (follower_id,followed_id ) VALUES ($1,$2) RETURNING *",
      [follower_id, followed_id],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          // If the result contains rows, it means the follow_user has followed the followed_user
          const followed = {
            message: "User Successfully Followed",
            followed: true,
          };
          resolve(followed);
        }
      }
    );
  });
};

export const unfollowUser = (req) => {
  const { follower_id, followed_id } = req.query;
  console.log(follower_id, followed_id);
  return new Promise((resolve, reject) => {
    pool.query(
      "DELETE FROM followers WHERE follower_id = $1 AND followed_id = $2 RETURNING *",
      [follower_id, followed_id],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          // If the result contains rows, it means the row was successfully deleted
          const unfollowed = {
            message: "User Successfully Unfollowed",
            unfollowed: true,
          };
          resolve(unfollowed);
        }
      }
    );
  });
};

export const userFollowerCount = (req) => {
  const {user_id}=req.query
  return new Promise((resolve, reject) => {
    pool.query("SELECT COUNT(*) FROM followers WHERE followed_id = $1"
    ,[user_id], (err, res) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      if (res) {  
        console.log(res.rows[0]);
        resolve(res.rows[0]);
      }
    });
  });
};
