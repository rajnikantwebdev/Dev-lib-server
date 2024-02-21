import {
  getDatabase,
  set,
  ref,
  onValue,
  get,
  child,
  push,
} from "firebase/database";
import { firebase } from "./server.js";

export const writeUserData = (userId, name, youtubeLink, tags, uniqueId) => {
  const db = getDatabase(firebase);
  const newPost = ref(db, `users/${userId}`);
  const newPostRef = push(newPost);
  set(newPostRef, {
    userId: userId,
    name: name,
    youtubeLink: youtubeLink,
    tags: tags,
    uniqueId: uniqueId,
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
      reject(err);
    }
  });
};
