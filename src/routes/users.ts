import express from "express";
import * as UserController from "../controllers/users";

const router = express.Router();

router.get("/", UserController.getAuthenticatedUser);
router.get("/logout", UserController.logout);
router.post("/login", UserController.login);

export default router;
