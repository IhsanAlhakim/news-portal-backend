import express from "express";
import * as CommentController from "../controllers/comments";
import { requiresAuth } from "../middleware/auth";

const router = express.Router();

router.get("/", CommentController.getComments);
router.get("/count", CommentController.getCommentsCount);
router.get("/:commentId", CommentController.getComment);
router.post("/", CommentController.createComment);
router.delete("/:commentId", requiresAuth, CommentController.deleteComment);

export default router;
