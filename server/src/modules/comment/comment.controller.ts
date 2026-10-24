import { Request, Response } from "express";
import { CommentServices } from "./comment.service.js";

const createComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    req.body.authorId = user?.id;
    const result = await CommentServices.createComment(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to create Comment" });
  }
};

const getCommentById = async (req: Request, res: Response) => {
  try {
    const {commentId} = req.params;
    const result = await CommentServices.getCommentById(commentId as string);
    res.status(201).json(result)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Comment" });
  }
};
const getCommentByAuthorId = async (req: Request, res: Response) => {
  try {
    const {authorId} = req.params;
    const result = await CommentServices.getCommentsByAuthor(authorId as string);
    res.status(201).json(result)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Author Comment" });
  }
};
const deleteComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const {commentId} = req.params;
    const result = await CommentServices.deleteComment(commentId as string, user?.id as string);
    res.status(201).json(result)
  } catch (error) {
    res.status(500).json({ error: "Failed to Delete Comment" });
  }
};
const updateComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const {commentId} = req.params;
    const result = await CommentServices.updateComment(commentId as string,req.body, user?.id as string);
    res.status(201).json(result)
  } catch (error) {
    res.status(500).json({ error: "Failed to Update Comment" });
  }
};
const modarateComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const {commentId} = req.params;
    const result = await CommentServices.modarateComment(commentId as string,req.body);
    res.status(201).json(result)
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : "Failed to Moderate Comment";
    res.status(500).json({ error: errorMessage });
  }
};


export const CommentController = {
  createComment,
  getCommentById,
  getCommentByAuthorId,
  deleteComment,
  updateComment,
  modarateComment
};
