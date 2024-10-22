import { RequestHandler } from "express";
import mongoose from "mongoose";
import { HttpError } from "../errors/http-errors";
import NewsModel from "../models/news";
import UserModel from "../models/user";

interface getNewsQuery {
  limit: string;
}

export const getNewsList: RequestHandler<
  unknown,
  unknown,
  unknown,
  getNewsQuery
> = async (req, res, next) => {
  const { limit } = req.query;
  let newsList;
  try {
    if (limit) {
      newsList = await NewsModel.find()
        .limit(Number(limit))
        .sort({ updatedAt: -1 })
        .exec();
    } else {
      newsList = await NewsModel.find().sort({ updatedAt: -1 }).exec();
    }
    res.status(200).json(newsList);
  } catch (error) {
    next(error);
  }
};

interface getNewsBySearchQuery {
  filter: string;
}

export const getNewsListBySearch: RequestHandler<
  unknown,
  unknown,
  unknown,
  getNewsBySearchQuery
> = async (req, res, next) => {
  const { filter } = req.query;
  try {
    const newsList = await NewsModel.find({
      $or: [
        { title: { $regex: filter, $options: "i" } },
        { content: { $regex: filter, $options: "i" } },
      ],
    })
      .sort({ updatedAt: -1 })
      .exec();
    res.status(200).json(newsList);
  } catch (error) {
    next(error);
  }
};

interface getNewsByCategoryQuery {
  category: string;
  limit: string;
}

export const getNewsListByCategory: RequestHandler<
  unknown,
  unknown,
  unknown,
  getNewsByCategoryQuery
> = async (req, res, next) => {
  const { category, limit } = req.query;
  let newsList;
  try {
    if (limit) {
      newsList = await NewsModel.find({ category: category })
        .sort({ updatedAt: -1 })
        .limit(Number(limit))
        .exec();
    } else {
      newsList = await NewsModel.find({ category: category })
        .sort({ updatedAt: -1 })
        .exec();
    }
    res.status(200).json(newsList);
  } catch (error) {
    next(error);
  }
};

export const getNews: RequestHandler = async (req, res, next) => {
  const newsId = req.params.newsId;

  try {
    if (!mongoose.isValidObjectId(newsId)) {
      throw new HttpError(400, "Invalid News Id");
    }

    const news = await NewsModel.findById(newsId).exec();
    if (!news) {
      throw new HttpError(404, "News Not Found");
    }
    res.status(200).json(news);
  } catch (error) {
    next(error);
  }
};

interface CreateNewsBody {
  title: string;
  content: string;
  image: string;
  category: "politics" | "sports" | "health" | "business" | "travel";
  status: "published" | "drafted";
}

export const createNews: RequestHandler<
  unknown,
  unknown,
  CreateNewsBody,
  unknown
> = async (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  const image = req.body.image;
  const category = req.body.category;
  const status = req.body.status;
  const authenticatedUserId = req.session.userId;
  try {
    if (!title) {
      throw new HttpError(400, "News must have title");
    }
    const author = await UserModel.findById(authenticatedUserId);

    if (!author) {
      throw new HttpError(401, "User Not Authenticated");
    }

    const newNews = await NewsModel.create({
      createdBy: author.username,
      editedBy: author.username,
      title: title,
      content: content,
      image: image,
      category: category,
      status: status,
    });
    res.status(201).json(newNews);
  } catch (error) {
    next(error);
  }
};

interface UpdateNewsParams {
  newsId?: string;
}

interface UpdateNewsBody {
  title: string;
  content: string;
  image: string;
  category: "politics" | "sports" | "health" | "business" | "travel";
  status: "published" | "drafted";
}

export const updateNews: RequestHandler<
  UpdateNewsParams,
  unknown,
  UpdateNewsBody,
  unknown
> = async (req, res, next) => {
  const newsId = req.params.newsId;
  const newTitle = req.body.title;
  const newContent = req.body.content;
  const newImage = req.body.image;
  const newCategory = req.body.category;
  const newStatus = req.body.status;
  const authenticatedUserId = req.session.userId;
  try {
    if (!mongoose.isValidObjectId(newsId)) {
      throw new HttpError(400, "Not a valid news id");
    }

    if (!newTitle) {
      throw new HttpError(400, "News must have title");
    }

    const news = await NewsModel.findById(newsId).exec();

    if (!news) {
      throw new HttpError(404, "News not found");
    }

    // if (!newContent) {
    //   throw new HttpError(400, "News must have content");
    // }

    const author = await UserModel.findById(authenticatedUserId);

    if (!author) {
      throw new HttpError(401, "User Not Authenticated");
    }

    news.title = newTitle;
    news.content = newContent;
    news.image = newImage;
    news.category = newCategory;
    news.status = newStatus;
    news.editedBy = author.username;

    const updatedNews = await news.save();

    res.status(200).json(updatedNews);
  } catch (error) {
    next(error);
  }
};

export const deleteNews: RequestHandler = async (req, res, next) => {
  const newsId = req.params.newsId;

  try {
    if (!mongoose.isValidObjectId(newsId)) {
      throw new HttpError(400, "Not a Valid News Id");
    }
    const news = await NewsModel.findById(newsId).exec();
    if (!news) {
      throw new HttpError(404, "No News Found");
    }

    await NewsModel.findByIdAndDelete(newsId);

    res.sendStatus(204); // status code untuk delete success
  } catch (error) {
    next(error);
  }
};

interface getCountNewsQuery {
  status: string;
}

export const getNewsCount: RequestHandler<
  unknown,
  unknown,
  unknown,
  getCountNewsQuery
> = async (req, res, next) => {
  let newsCount;
  const { status } = req.query;
  try {
    if (status) {
      newsCount = await NewsModel.countDocuments({
        status: status,
      });
    } else {
      newsCount = await NewsModel.countDocuments();
    }
    res.status(200).json({ newsCount: newsCount });
  } catch (error) {
    next(error);
  }
};