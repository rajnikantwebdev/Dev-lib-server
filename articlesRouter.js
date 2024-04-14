import ogs from "open-graph-scraper";
import { pool } from "./server.js";

export const addArticle = (body) => {
  return new Promise((resolve, reject) => {
    const { userId, title, url, review, comment } = body;
    const options = { url: url };
    console.log("before options");
    ogs(options).then((data) => {
      const { error, result } = data;
      console.log("error: ", error, "result: ", result);
      if (error) {
        console.log("ops error: ", error);
        reject({ errorsMessage: error });
      } else {
        console.log("result: ", result.ogImage[0]);
        let imgUrl = result?.ogImage[0]?.url;
        let imgAlt = result?.ogImage[0]?.alt;

        if (!imgAlt) {
          imgAlt = title;
        }
        pool.query(
          "INSERT INTO article_bucket (user_id, title, url, imgUrl, imgAlt, comment, review) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *",
          [userId, title, url, imgUrl, imgAlt, comment, review],
          (error, result) => {
            if (error) {
              console.log("pool error: ", error);
              reject(error);
            } else {
              resolve({
                message: "New Article has been added",
                data: result,
              });
            }
          }
        );
      }
    });
    console.log("after options");
  });
};

export const getAllArticles = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM article_bucket WHERE approved = true",
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
