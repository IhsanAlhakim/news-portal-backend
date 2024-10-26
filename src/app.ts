import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import session from "express-session";
import morgan from "morgan";
import { HttpError } from "./errors/http-errors";
import commentRoute from "./routes/comments";
import newsRoute from "./routes/news";
import userRoute from "./routes/users";

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

app.use("/users", userRoute);
app.use("/news", newsRoute);
app.use("/comments", commentRoute);

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
