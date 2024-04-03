import express from "express";
import getUserPostCountApi from "./userDetailsFunction.js";
const app = express();

function getUserPostCount() {
  app.post("/api/user/post-count", async (req, res) => {
    try {
      const response = await getUserPostCountApi(req.body);
      res.status(200).json({ data: response });
    } catch (error) {
      console.log("error while getting post count: ", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
}

export default getUserPostCount;
