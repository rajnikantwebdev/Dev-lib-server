import { pool } from "./server.js";

// api to add video id in user saved videos
export const addVideoIdInSavedPost = (body) => {
  return new Promise((resolve, reject) => {
    const { userId, vid_id } = body;
    pool.query(
      "UPDATE video_bucket SET saved_videos = array_append(saved_videos, $2) WHERE user_id = $1",
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

// api to check if the video id already exists in the array or not
export const checkIfVideoIdExists = (body) => {
  return new Promise((resolve, reject) => {
    const { userId, vid_id } = body;
    pool.query(
      "SELECT saved_videos FROM video_bucket WHERE $2 = ANY(saved_videos) AND user_id = $1",
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

// api to remove video id from the saved list
export const removeVideoIdFromSavedList = (body) => {
  return new Promise((resolve, reject) => {
    const { userId, vid_id } = body;
    pool.query(
      "UPDATE video_bucket SET saved_videos = array_remove(saved_videos, $2) WHERE user_id = $1",
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

export const getAllSavedVideos = (body) => {
  return new Promise((resolve, reject) => {
    const { userId } = body;
    pool.query(
      "SELECT saved_videos FROM video_bucket WHERE user_id = $1",
      [userId],
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.rows[0]?.saved_videos);
        }
      }
    );
  });
};
