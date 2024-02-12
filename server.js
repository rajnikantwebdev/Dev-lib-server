import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const app = express();
const fetch = (...args) =>
  import(node - fetch).then(({ default: fetch }) => fetch(...args));

const firebaseConfig = {
  apiKey: "AIzaSyDBt60YVWPEvQGMvOTCfyJAuJY0_hU4XRA",
  authDomain: "devlib-c6572.firebaseapp.com",
  databaseURL:
    "https://devlib-c6572-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "devlib-c6572",
  storageBucket: "devlib-c6572.appspot.com",
  messagingSenderId: "553953347527",
  appId: "1:553953347527:web:2ebde7a35ff5917e2cbbe2",
  measurementId: "G-CM76FGV328",
};

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(4000, function () {
  console.log("Cors server Running on Port 4000");
});
