import { pool } from "./server.js";

export const getUserDetailsForUserPage = async (user_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM users WHERE user_id = $1",
      [user_id],
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

export const addUserIdToUsersTable = (body) => {
  return new Promise(function (resolve, reject) {
    const {
      name,
      user_name,
      email,
      profilepicture,
      user_id,
      creation_time,
      socialmedialinks,
    } = body.user;
    console.log("request:", body.user);

    pool.query(
      "INSERT INTO users (name,user_name,email,profilepicture,user_id,creation_time,socialmedialinks) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *",
      [
        name,
        user_name,
        email,
        profilepicture,
        user_id,
        creation_time,
        socialmedialinks,
      ],
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

export const searchUserValues = async (words) => {
  console.log(words);
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT user_id ,user_name, name FROM users WHERE name ILIKE $1",
      [`%${words}%`],
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

//now the router through which the user will have

export const createUserBukcet = (body) => {
  const { uid } = body;
  console.log(uid);

  return new Promise((OuterResolve, OuterReject) => {
    pool.query(
      "SELECT user_name FROM users where user_id= $1",
      [uid],
      (error, result) => {
        if (error) {
          console.log("error:", error);
          OuterReject(error);
        }
        if (result) {
          console.log("result", result["rows"][0]);
          const userName = result["rows"][0]["user_name"];
          new Promise((resolve, reject) => {
            pool.query(
              "INSERT INTO video_bucket (user_id,user_name) VALUES ($1,$2)",
              [uid, userName],
              (error, result) => {
                if (error) {
                  console.log(error);
                  if ((error.code = "23505")) {
                    reject("the userBucket Already Exist");
                  }
                  reject(error);
                } else {
                  const response = {
                    message: "Users Bucket Created Successfully",
                    bucketCreated: true,
                  };
                  resolve(response);
                  OuterResolve(response);
                }
              }
            );
          });
        }
      }
    );
  });
};

export const checkUserExistence = (body) => {
  console.log("we got here");

  const { user_id } = body;
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT COUNT(*) AS user_count FROM users WHERE user_id = $1",
      [user_id],
      (error, result) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          // If user_count is greater than 0, the user exists
          const userExists = result.rows[0].user_count > 0;
          resolve(userExists);
        }
      }
    );
  });
};

export const getUserProfilePicture = (user_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT profilepicture FROM users WHERE user_id=$1",
      [user_id],
      (error, result) => {
        if (error) {
          reject(error);
        }
        if (result) {
          resolve(result.rows[0]);
        }
      }
    );
  });
};

export const getallUserDataFromDatabase = (user_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM users WHERE user_id=$1",
      [user_id],
      (error, result) => {
        if (error) {
          console.log(error);
          reject(error);
        }
        if (result) {
          console.log(result.rows);
          resolve(result.rows[0]);
        }
      }
    );
  });
};







export const updateUser = (user) => {

  console.log("socialMedia Links",user.socialmedialinks)
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE users SET  socialmedialinks = $1, website = $2, name = $3 WHERE user_id = $4",
      [
        user.socialmedialinks,
        user.website,
        user.name,
        user.user_id,
      ],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          const response = {
            message: "Users Data Updated Successfully",
          };
          resolve(response);
          resolve(results); // Assuming you want to return the number of rows affected
        }
      }
    );
  });
};

export const updateUserImageUrl = async (req) => {
  const { user_id, img_link } = req;
  console.log(user_id, img_link )

  return new Promise((res, rej) => {
    pool.query(
      'UPDATE users SET profilepicture = $1 WHERE user_id = $2',
        [img_link, user_id],
      (error, result) => {
        if (error) {
          rej(error);
        }
        if (result) {
          res(result);
        }
      }
    );
  });
};
