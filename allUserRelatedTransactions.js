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



