import express from "express";
import auth, { UserRole } from "../../middlewares/auth.js";
import { CommentController } from "./comment.controller.js";

const router = express.Router();

router.get("/:commentId", CommentController.getCommentById);
router.get("/author/:authorId", CommentController.getCommentByAuthorId);
router.post(
  "/",
  auth(UserRole.USER, UserRole.ADMIN),
  CommentController.createComment,
);
router.patch(
  "/:commentId",
  auth(UserRole.USER, UserRole.ADMIN),
  CommentController.updateComment,
);
router.patch(
  "/:commentId/modarate",
 //auth(UserRole.ADMIN),
  CommentController.modarateComment,
);

router.delete(
  "/:commentId",
  auth(UserRole.USER, UserRole.ADMIN),
  CommentController.deleteComment,
);

export const commentRouter = router;
