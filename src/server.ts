import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app";

dotenv.config();

const mongoDbUrl = process.env.MONGO_CONNECTION_STRING || "";
const port = process.env.PORT || "";

mongoose
  .connect(mongoDbUrl)
  .then(() => {
    console.log("Mongoose connected");
    app.listen(port, () => {
      console.log("Server running on port: " + port);
    });
  })
  .catch(console.error);
