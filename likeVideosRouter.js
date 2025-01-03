import { pool } from "./server.js";

// add the user like if he haven't liked it
export const addUserLike = (body) => {
  return new Promise((resolve, reject) => {
    const { userId, vid_id } = body;
    pool.query(
      "INSERT INTO video_bucket (user_id, liked_videos) VALUES ($1, ARRAY[$2]) ON CONFLICT (user_id) DO UPDATE SET liked_videos = array_append(video_bucket.liked_videos, $2)",
      [userId, vid_id],
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
// remove the user like id he already like it
export const removeUserLikedVideo = (body) => {
  return new Promise((resolve, reject) => {
    const { userId, unique_id } = body;
    pool.query(
      "UPDATE video_bucket SET liked_videos = array_remove(liked_videos, $2) WHERE user_id = $1",
      [userId, unique_id],
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

// get all the liked video by the user
export const getAllLikedVideos = (body) => {
  return new Promise((resolve, reject) => {
    const { userId } = body;
    pool.query(
      "SELECT liked_videos FROM video_bucket WHERE user_id = $1",
      [userId],
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.rows[0]);
        }
      }
    );
  });
};

// check if the user has already liked the video
export const checkIfLikedVideoExists = (body) => {
  return new Promise((resolve, reject) => {
    const { userId, vid_id } = body;
    pool.query(
      "SELECT liked_videos FROM users WHERE $2 = ANY(liked_videos) AND user_id = $1",
      [userId, vid_id],
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

// api to increment like count
export const incrementLikeCount = (body) => {
  return new Promise((resolve, reject) => {
    const { primary_id } = body;
    pool.query(
      "UPDATE videos_like_and_dislike SET like_count = like_count + 1 WHERE id = $1",
      [primary_id],
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
// api to decrement like count
export const decrementLikeCount = (body) => {
  return new Promise((resolve, reject) => {
    const { primary_id } = body;
    pool.query(
      "UPDATE videos_like_and_dislike SET like_count = like_count - 1 WHERE id = $1",
      [primary_id],
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

// api to get total likes
export const getAllLikesFromVideos = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM videos_like_and_dislike", (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result.rows);
      }
    });
  });
};
