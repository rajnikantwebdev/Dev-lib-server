import { pool } from "./server.js";

export default function getUserPostCountApi(body) {
  return new Promise((resolve, reject) => {
    const { userId } = body;
    pool.query(
      "SELECT COUNT(vid_id) FROM ytvid WHERE user_id = $1",
      [userId],
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.rows[0].count);
        }
      }
    );
  });
}
