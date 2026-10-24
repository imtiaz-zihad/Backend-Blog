import express from "express";
import { postController } from "./post.controller.js";
import auth, { UserRole } from "../../middlewares/auth.js";

const router = express.Router();

router.get("/", postController.getAllPosts);
router.get("/my-posts", auth(UserRole.USER), postController.getMyPosts);
router.get("/statistics", auth(UserRole.ADMIN, UserRole.USER), postController.getPostStatistics);
router.get("/:postId", postController.getPostById);
router.patch("/:postId", auth(UserRole.USER), postController.updateMyPost);
router.post("/", auth(UserRole.USER), postController.createPost);
router.delete("/:postId", auth(UserRole.USER , UserRole.ADMIN), postController.deleteMyPost);

export const postRouter = router;
