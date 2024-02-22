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

export const writeUserData = (request, response) => {
  const { userId, youtubeVideoId, tags } = request.body;
  const dataObj = { youtubeVideoId, tags };
  const jsonData = JSON.stringify(dataObj);

  const youtubeVideoIdArray = [jsonData];
  pool.query(
    "INSERT INTO youtubevideos (id, ytvid) VALUES ($1, $2) RETURNING *",
    [userId, youtubeVideoIdArray],
    (error, result) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`User added with Id`);
    }
  );
};

export const addUserId = (request, response) => {
  const { userId } = request.body;
  pool.query(
    "INSERT INTO users (user_id) VALUES($1) RETURNING *",
    [userId],
    (error, result) => {
      if (error) {
        throw error;
      }
      response.status(201).send("user id added successfully");
    }
  );
};

// export const writeUserData = (userId, name, youtubeLink, tags, uniqueId) => {
//   const db = getDatabase(firebase);
//   const newPost = ref(db, `users/${userId}`);
//   const newPostRef = push(newPost);
//   set(newPostRef, {
//     userId: userId,
//     name: name,
//     youtubeLink: youtubeLink,
//     tags: tags,
//     uniqueId: uniqueId,
//   });
// };

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
      reject(err);
    }
  });
};
