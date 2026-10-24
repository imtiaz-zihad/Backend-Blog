import { CommentStatus } from "../../../generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";

const createComment = async (payload: {
  content: string;
  authorId: string;
  postId: string;
  parentId?: string;
}) => {
  const postData = await prisma.post.findUniqueOrThrow({
    where: {
      id: payload.postId,
    },
  });

  if (payload.parentId) {
    const parentData = await prisma.comment.findUniqueOrThrow({
      where: {
        id: payload.parentId,
      },
    });
  }
  return await prisma.comment.create({
    data: payload,
  });
};

const getCommentById = async (id: string) => {
  return await prisma.comment.findUnique({
    where: {
      id,
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
          views: true,
        },
      },
    },
  });
};

const getCommentsByAuthor = async (authorId: string) => {
  return await prisma.comment.findMany({
    where: {
      authorId,
    },

    orderBy: {
      createdAt: "desc",
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
};

const deleteComment = async (commentId: string, authorId: string) => {
  const commentData = await prisma.comment.findFirst({
    where: {
      id: commentId,
      authorId,
    },
    select: {
      id: true,
    },
  });

  if (!commentData) {
    throw new Error("You Provide Wrong Comment ID");
  }

  return await prisma.comment.delete({
    where: {
      id: commentData.id,
    },
  });
};

const updateComment = async (
  commentId: string,
  data: { content?: string; status?: CommentStatus },
  authorId: string,
) => {
    const commentData = await prisma.comment.findFirst({
    where: {
      id: commentId,
      authorId,
    },
    select: {
      id: true,
    },
  });

  if (!commentData) {
    throw new Error("You Provide Wrong Comment ID");
  }


  return await prisma.comment.update({
    where:{
      id: commentId,
      authorId
    },
    data
  })
};

const modarateComment = async(id: string, data: { status: CommentStatus }) =>{
 const commentData =  await prisma.comment.findUniqueOrThrow({
    where:{
      id
    },
    select : {
      id: true,
      status: true
    }
  })

  if(commentData.status === data.status){
    throw new Error("Comment is already in the requested status");
  }

  return await prisma.comment.update({
    where:{
      id
    },
    data
  })
  
  
}
export const CommentServices = {
  createComment,
  getCommentById,
  getCommentsByAuthor,
  deleteComment,
  updateComment,
  modarateComment
};
