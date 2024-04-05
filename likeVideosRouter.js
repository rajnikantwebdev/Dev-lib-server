import { pool } from "./server.js";

// add the user like if he haven't liked it
export const addUserLike = (body) => {
  return new Promise((resolve, reject) => {
    const { userId, vid_id } = body;
    pool.query(
      "UPDATE video_bucket SET liked_videos = array_append(liked_videos, $2) WHERE uid = $1",
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
    const { userId, vid_id } = body;
    pool.query(
      "UPDATE users SET liked_videos = array_remove(liked_videos, $2) WHERE user_id = $1",
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

// get all the liked video by the user
export const getAllLikedVideos = (body) => {
  return new Promise((resolve, reject) => {
    const { userId } = body;
    pool.query(
      "SELECT liked_videos FROM video_bucket WHERE uid = $1",
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
    const { vid_id } = body;
    pool.query(
      "UPDATE ytvid SET likes_count = likes_count + 1 WHERE vid_id = $1",
      [vid_id],
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
    const { vid_id } = body;
    pool.query(
      "UPDATE ytvid SET likes_count = likes_count - 1 WHERE vid_id = $1",
      [vid_id],
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
// api to get all the likes on videos
// export const findAllLikeVideos = (body) => {
//   return new Promise((resolve, reject) => {

//   })
// }
