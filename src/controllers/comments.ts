import { RequestHandler } from "express";
import CommentModel from "../models/news-comments";
import mongoose from "mongoose";
import { HttpError } from "../errors/http-errors";

interface getCommentsByNewsId {
  newsId: string;
}

export const getComments: RequestHandler<
  unknown,
  unknown,
  unknown,
  getCommentsByNewsId
> = async (req, res, next) => {
  const { newsId } = req.query;
  try {
    if (!newsId) {
      throw new HttpError(400, "Parameter Missing");
    }
    const commentList = await CommentModel.find({ newsId: newsId })
      .sort({ createdAt: -1 })
      .exec();
    res.status(200).json(commentList);
  } catch (error) {
    next(error);
  }
};

export const getComment: RequestHandler = async (req, res, next) => {
  const commentId = req.params.commentId;

  try {
    if (!mongoose.isValidObjectId(commentId)) {
      throw new HttpError(400, "News Id Not Valid");
    }

    const comment = await CommentModel.findById(commentId).exec();
    if (!comment) {
      throw new HttpError(404, "No Comment Found");
    }
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

interface CreateCommentBody {
  newsId?: string;
  comment?: string;
}

export const createComment: RequestHandler<
  unknown,
  unknown,
  CreateCommentBody,
  unknown
> = async (req, res, next) => {
  const comment = req.body.comment;
  const newsId = req.body.newsId;
  try {
    if (!comment || !newsId) {
      throw new HttpError(400, "Parameter Missing");
    }

    const newComment = await CommentModel.create({
      newsId: newsId,
      comment: comment,
    });

    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
};

export const deleteComment: RequestHandler = async (req, res, next) => {
  const commentId = req.params.commentId; //gk perlu bikin interface karena gk ada req body yang harus didefinisiin tipe datanya

  try {
    if (!mongoose.isValidObjectId(commentId)) {
      throw new HttpError(400, "News Id is Not Valid");
    }
    const comment = await CommentModel.findById(commentId).exec();
    if (!comment) {
      throw new HttpError(404, "No Comment");
    }

    await CommentModel.findByIdAndDelete(commentId);

    res.sendStatus(204); // status code untuk delete success
  } catch (error) {
    next(error);
  }
};

interface CommentCountQuery {
  newsId: string;
}

export const getCommentsCount: RequestHandler<
  unknown,
  unknown,
  unknown,
  CommentCountQuery
> = async (req, res, next) => {
  try {
    const { newsId } = req.query;
    let commentsCount;
    if (newsId) {
      commentsCount = await CommentModel.countDocuments({ newsId: newsId });
    } else {
      commentsCount = await CommentModel.countDocuments();
    }
    res.status(200).json({ commentsCount: commentsCount });
  } catch (error) {
    next(error);
  }
};
