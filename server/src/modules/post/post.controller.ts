import { NextFunction, Request, Response } from "express";
import { postService } from "./post.service.js";
import { Status } from "../../../generated/prisma/enums.js";
import paginationSortingHelper from "../../helpers/paginationSortingHelper.js";
import { error } from "node:console";
import { UserRole } from "../../middlewares/auth.js";

const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const result = await postService.createPost(req.body, user.id as string);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const getAllPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : undefined;

    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];
    const isFeatured = req.query.isFeatured
      ? req.query.isFeatured === "true"
        ? true
        : req.query.isFeatured === "false"
          ? false
          : undefined
      : undefined;

    const status = req.query.status as Status | undefined;

    const authorId = req.query.authorId as string;

    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(
      req.query,
    );
    console.log({ page, limit, skip, sortBy, sortOrder });

    const result = await postService.getAllPosts({
      search: searchString,
      tags,
      isFeatured,
      status,
      authorId,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getPostById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId } = req.params;
    if (typeof postId !== "string" || !postId) {
      throw new Error("Post Id is required ");
    }
    const result = await postService.getPostById(postId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
const getMyPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const result = await postService.getMyPosts(user.id as string);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
const updateMyPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { postId } = req.params;
    const isAdmin = user.role === UserRole.ADMIN;
    // console.log(user);

    const data = req.body;
    const result = await postService.updateMyPost(
      postId as string,
      user.id as string,
      data,
      isAdmin,
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
const deleteMyPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { postId } = req.params;
    const isAdmin = user.role === UserRole.ADMIN;
    // console.log(user);

    const data = req.body;
    const result = await postService.deleteMyPost(
      postId as string,
      user.id as string,
      isAdmin,
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getPostStatistics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await postService.getPostStatistics();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const postController = {
  createPost,
  getAllPosts,
  getPostById,
  getMyPosts,
  updateMyPost,
  deleteMyPost,
  getPostStatistics,
};
