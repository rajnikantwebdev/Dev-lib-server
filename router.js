import { pool } from "./server.js";

// api so that user can upload youtube video
export async function addVideo(reqBody) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN"); // Start transaction

    // Insert data into the users table
    const videoData = {
      userId: reqBody.userId,
      title: reqBody.title,
      vid_id: reqBody.vid_id,
      tags: reqBody.tags,
    };
    const videoQuery =
      "INSERT INTO ytvids (user_id, title, vid_id, created_at, tags) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4) RETURNING id";
    const videoValues = [
      videoData.userId,
      videoData.title,
      videoData.vid_id,
      videoData.tags,
    ];
    const userResult = await client.query(videoQuery, videoValues);
    const id = userResult.rows[0].id;

    // Insert data into the video_likes_and_dislikes table
    const likeDislikeData = {
      id: id,
      vid_id: reqBody.vid_id,
    };
    const likeDislikeQuery =
      "INSERT INTO videos_like_and_dislike (id, vid_id) VALUES ($1, $2) RETURNING *";
    const likeDislikeValues = [likeDislikeData.id, likeDislikeData.vid_id];
    await client.query(likeDislikeQuery, likeDislikeValues);

    await client.query("COMMIT"); // Commit transaction
    return { success: true, id };
  } catch (error) {
    await client.query("ROLLBACK"); // Rollback transaction if there's an error
    throw error;
  } finally {
    client.release(); // Release client back to the pool
  }
}

//api to get all youtube videos
export const getAllVideoData = (page, limit, query) => {
  return new Promise(function (resolve, reject) {
    const offset = (page - 1) * limit;
    !query
      ? pool.query(
          "SELECT ytvids.id, user_id, title, ytvids.vid_id, created_at, tags, like_count FROM ytvids INNER JOIN videos_like_and_dislike ON ytvids.id = videos_like_and_dislike.id LIMIT $1 OFFSET $2",
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
        )
      : pool.query(
          "SELECT ytvids.id, user_id, title, ytvids.vid_id, created_at, tags, like_count FROM ytvids INNER JOIN videos_like_and_dislike ON ytvids.id = videos_like_and_dislike.id WHERE ts @@ to_tsquery('english', $1) LIMIT $2 OFFSET $3",
          [query, limit, offset],
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

export const fetchPopularVideos = (page, limit) => {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * limit;
    console.log("offset: ", offset);
    pool.query(
      "SELECT ytvids.id, user_id, title, ytvids.vid_id, created_at, tags, like_count FROM ytvids INNER JOIN videos_like_and_dislike ON ytvids.id = videos_like_and_dislike.id ORDER BY like_count DESC LIMIT $1 OFFSET $2",
      [limit, offset],
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
