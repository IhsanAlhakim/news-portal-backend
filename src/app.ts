import express, { NextFunction, Request, Response } from "express";
import userRoute from "./routes/users";
import newsRoute from "./routes/news";
import commentRoute from "./routes/comments";
import morgan from "morgan";
import session from "express-session";
import dotenv from "dotenv";
import MongoStore from "connect-mongo";
import { HttpError } from "./errors/http-errors";
import cors from "cors";

dotenv.config();

const mongoDbUrl = process.env.MONGO_CONNECTION_STRING || "";
const sessionSecret = process.env.SESSION_SECRET || "";

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000,
    },
    rolling: true,
    store: MongoStore.create({
      mongoUrl: mongoDbUrl,
    }),
  })
);

app.use("/api/users", userRoute);
app.use("/api/news", newsRoute);
app.use("/api/comments", commentRoute);

app.use((req, res, next) => {
  next(new HttpError(404, "Endpoint not found"));
});

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  let errorMessage = "An unknown error occurred";
  let statusCode = 500;

  if (error instanceof HttpError) {
    statusCode = error.statusCode;
    errorMessage = error.message;
  }
  res.status(statusCode).json({ error: errorMessage });
});

export default app;
