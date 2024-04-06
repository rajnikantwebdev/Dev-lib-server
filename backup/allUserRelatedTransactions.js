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

export const getAllUserIdAndName = async (name) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT user_id, user_name, name FROM users WHERE name LIKE $1 ",
      [`%${name}%`],
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

export const userValues = async (words) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT user_id , name FROM users WHERE name ILIKE $1",
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
          const userName = result["rows"][0]["user_name"];new Promise((resolve, reject) => {
            pool.query(
              "INSERT INTO video_bucket (user_id,user_name) VALUES ($1,$2) ",
              [uid, userName],
              (error, result) => {
                if (error) {
                  console.log(error);
                  if(error.code='23505'){
                    reject("the userBucket Already Exist")
                  }
                  reject(error);
                } else {
                  const response = {
                    message: "Users Bucket Created Successfully",
                    bucketCreated: true,
                  };
                  resolve(response);
                  OuterResolve(response)
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
