import express from "express";
import * as NewsController from "../controllers/news";
import { requiresAuth } from "../middleware/auth";

const router = express.Router();
router.get("/", NewsController.getNewsListForAdmin);
router.get("/user", NewsController.getNewsListForUser);
router.get("/category", NewsController.getNewsListByCategory);
router.get("/count", NewsController.getNewsCount);
router.get("/search", NewsController.getNewsListBySearchQuery);
router.get("/:newsId", NewsController.getNews);
router.post("/", requiresAuth, NewsController.createNews);
router.patch("/:newsId", requiresAuth, NewsController.updateNews);
router.delete("/:newsId", requiresAuth, NewsController.deleteNews);

export default router;
