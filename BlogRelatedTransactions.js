import { pool } from "./server.js";

const skelTonFunction = (queryString, qureyReferenceArr) => {
  return new Promise((resolve, reject) => {
    pool.query(queryString, qureyReferenceArr, (err, res) => {
      if (err) {
        console.log("yes We Got it");
        console.log(err);
        reject(err);
      }
      if (res) {
        console.log("i am resolved");
        console.log(res.rows);
        resolve(res.rows);
      }
    });
  });
};

export const getAllBlogs = (req) => {
  const limit = req.body.numberofblogs;
  return skelTonFunction(
    "SELECT * FROM blog_reference ORDER BY upload_date DESC LIMIT $1",
    [limit]
  );
};

export const createBlog = (req) => {
  const { author_id, blog_data } = req.body;
  return skelTonFunction(
    "INSERT INTO blog_bucket (author_id,blog_data)  VALUES ($1,$2) RETURNING blog_id ",
    [author_id, blog_data]
  );
};

export const createBlogReference = (req) => {
  console.log("blog-reference creation");
  const {
    blog_id,
    blog_title,
    blog_description,
    blog_tags,
    blog_thumbnail_url,
    author_name,
    author_user_id,
    author_user_name,
    user_profile_pic_url,
  } = req.body;

  const query =
    "INSERT INTO blog_reference (blog_id,blog_title,blog_description,blog_tags ,blog_thumbnail_url,author_name ,author_user_id,author_user_name,user_profile_pic_url) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) returning *";

  const queryRef = [
    blog_id,
    blog_title,
    blog_description,
    blog_tags,
    blog_thumbnail_url,
    author_name,
    author_user_id,
    author_user_name,
    user_profile_pic_url,
  ];

  return skelTonFunction(query, queryRef);
};


    