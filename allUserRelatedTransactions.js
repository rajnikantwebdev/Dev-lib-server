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
}
    

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
}


export const userValues=async(words)=>{
    return new Promise((resolve,reject)=>{
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
    })
}

