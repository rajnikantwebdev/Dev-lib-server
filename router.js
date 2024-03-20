import { pool } from "./server.js";

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

// export const increaseLikeCount = (id) => {
//   return new Promise(function (resolve, reject) {
//     pool.query(
//       "UPDATE ytvid SET like_count = like_count + 1 WHERE vid_id = $1",
//       [id],
//       (error, result) => {
//         if (error) {
//           reject(error);
//         } else {
//           resolve(result.rowCount);
//         }
//       }
//     );
//   });
// };

// api to add increase like count of a particular video
export const addVideoId = (body) => {
  return new Promise(function (resolve, reject) {
    const { vid_id } = body;
    console.log(vid_id);
    pool.query(
      "INSERT INTO total_likes (vid_id, likes_count) VALUES($1, 0)",
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

// api to get like count of a particular video
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
            // console.log("result: ", result.rows);
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
export const addUserLike = async (body) => {
  try {
    const { userId, vid_id, action } = body;
    if (action === "like") {
      await pool.query(
        "INSERT INTO user_likes (user_id, vid_id, action) VALUES ($1, $2, 'like')",
        [userId, vid_id]
      );
    } else if (action === "unlike") {
      await pool.query(
        "UPDATE user_likes SET action = 'unlike' WHERE user_id = $1 AND vid_id = $2",
        [userId, vid_id]
      );
    }
  } catch (error) {
    console.log(error);
  }
};

// api to update user likes in ytvid table
export const updateLikesInYtvidTable = (body) => {
  return new Promise(function (resolve, reject) {
    const { vid_id, action } = body;

    if (action === "like") {
      pool.query(
        "UPDATE ytvid SET like_count = like_count - 1 WHERE vid_id = $1",
        [vid_id],
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    } else if (action === "unlike") {
      pool.query(
        "UPDATE ytvid SET like_count = like_count + 1 WHERE vid_id = $1",
        [vid_id],
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    } else {
      reject(new Error("Invalid action"));
    }
  });
};

// api to check if the video is liked or not
export const isLiked = (body) => {
  return new Promise(function (resolve, reject) {
    const { userId, vid_id } = body;
    pool.query(
      "SELECT action FROM user_likes WHERE user_id = $1 AND vid_id = $2",
      [userId, vid_id],
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
// api to get all the liked videos
export const getAllLikedVideos = () => {
  return new Promise(function (resolve, reject) {
    pool.query("SELECT vid_id FROM user_likes", (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result.rows);
      }
    });
  });
};

export const getUpdateLikedVideo = (body) => {
  return new Promise(function (resolve, reject) {
    const { lastTimeStamp } = body;
    pool.query(
      "SELECT vid_id FROM user_likes WHERE created_at > $1",
      [lastTimeStamp],
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
