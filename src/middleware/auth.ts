import { RequestHandler } from "express";
import { HttpError } from "../errors/http-errors";

export const requiresAuth: RequestHandler = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    next(new HttpError(401, "User Not Authenticated"));
  }
};
