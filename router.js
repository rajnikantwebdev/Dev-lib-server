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

export const writeUserData = (body) => {
  return new Promise(function (resolve, reject) {
    const { userId, youtubeVideoId, tags } = body;

    const dataObj = { youtubeVideoId, tags };
    const jsonData = JSON.stringify(dataObj);
    const yt_vid_data = [jsonData];
    console.log("userId: ", userId);
    pool.query(
      "INSERT INTO ytvidcontainer (user_id, yt_vid_data) VALUES ($1, $2) RETURNING *",
      [userId, yt_vid_data],
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

export const getAllData = () => {
  return new Promise(async (resolve, reject) => {
    const dbRef = ref(getDatabase(firebase));
    const dataArray = [];

    try {
      const getData = await get(child(dbRef, "users/"));

      const snapshot = getData;
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          dataArray.push(childSnapshot.val());
        });

        resolve(dataArray);
      } else {
        resolve([]);
      }
    } catch (error) {
      console.log("error-getting-all-data: ", error);
      reject(error);
    }
  });
};
