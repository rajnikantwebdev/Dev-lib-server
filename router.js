import { getDatabase, set, ref } from "firebase/database";
import { firebase } from "./server.js";

export const writeUserData = (userId, name, data, isAdded) => {
  const db = getDatabase(firebase);
  set(ref(db, "users/" + userId), {
    username: name,
    data: data,
    isAdded: isAdded,
  });
};
