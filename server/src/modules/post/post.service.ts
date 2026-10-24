import {
  CommentStatus,
  Post,
  Status,
} from "../../../generated/prisma/client.js";
import { PostWhereInput } from "../../../generated/prisma/models.js";
import { prisma } from "../../lib/prisma.js";

const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">,
  userId: string,
) => {
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: userId,
    },
  });
  return result;
};

const getAllPosts = async ({
  search,
  tags,
  isFeatured,
  status,
  authorId,
  page,
  limit,
  skip,
  sortBy,
  sortOrder,
}: {
  search: string | undefined;
  tags: string[] | [];
  isFeatured: boolean | undefined;
  status: Status | undefined;
  authorId: string | undefined;
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
}) => {
  const andCondition: PostWhereInput[] = [];
  if (search) {
    andCondition.push({
      OR: [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          tags: {
            has: search,
          },
        },
      ],
    });
  }

  if (tags.length) {
    andCondition.push({
      tags: {
        hasEvery: tags as string[],
      },
    });
  }

  if (typeof isFeatured === "boolean") {
    andCondition.push({
      isFeatured,
    });
  }

  if (status) {
    andCondition.push({
      status,
    });
  }

  if (authorId) {
    andCondition.push({
      authorId,
    });
  }
  const allPost = await prisma.post.findMany({
    take: limit,
    skip,
    where: {
      AND: andCondition,
    },

    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      _count: {
        select: { comments: true },
      },
    },
  });

  const total = await prisma.post.count({
    where: {
      AND: andCondition,
    },
  });

  return {
    data: allPost,
    pagination: {
      total,
      page,
      limit,
      totalpages: Math.ceil(total / limit),
    },
  };
};

const getPostById = async (postId: string) => {
  return await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id: postId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    const postData = await tx.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        comments: {
          where: {
            parentId: null,
            status: CommentStatus.APPROVED,
          },
          orderBy: { createdAt: "desc" },
          include: {
            replies: {
              where: {
                status: CommentStatus.APPROVED,
              },

              orderBy: { createdAt: "asc" },

              include: {
                replies: {
                  where: {
                    status: CommentStatus.APPROVED,
                  },
                  orderBy: { createdAt: "asc" },
                },
              },
            },
          },
        },
        _count: {
          select: { comments: true },
        },
      },
    });
    return postData;
  });
};

const getMyPosts = async (authorId: string) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      id: authorId,
      status: "ACTIVE",
    },
    select: {
      id: true,
    },
  });
  const result = await prisma.post.findMany({
    where: {
      authorId: authorId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: { comments: true },
      },
    },
  });

  const total = await prisma.post.count({
    where: {
      authorId: authorId,
    },
  });

  return {
    data: result,
    total,
  };
};

const updateMyPost = async (
  postId: string,
  authorId: string,
  data: Partial<Post>,
  isAdmin: boolean,
) => {
  const postData = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
    select: {
      authorId: true,
      id: true,
    },
  });

  if (postData.authorId !== authorId && !isAdmin) {
    throw new Error("Unauthorized to update this post");
  }

  if (!isAdmin) {
    delete data.isFeatured;
  }

  const result = await prisma.post.update({
    where: {
      id: postId,
    },
    data,
  });

  return result;
};

const deleteMyPost = async (
  postId: string,
  authorId: string,
  isAdmin: boolean,
) => {
  const postData = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
    select: {
      authorId: true,
      id: true,
    },
  });

  if (postData.authorId !== authorId && !isAdmin) {
    throw new Error("Unauthorized to delete this post");
  }

  const result = await prisma.post.delete({
    where: {
      id: postId,
    },
  });
  return result;
};

const getPostStatistics = async () => {
  return await prisma.$transaction(async (tx) => {
    const [
      totalPosts,
      totalPublishedPosts,
      totalDraftPosts,
      totalArchivedPosts,
      totalComment,
      approvedComment,
      totalUsers,
      adminCount,
      userCount,
      totalViews,
    ] = await Promise.all([
      await tx.post.count(),
      await tx.post.count({
        where: {
          status: Status.PUBLISHED,
        },
      }),
      await tx.post.count({
        where: {
          status: Status.DRAFT,
        },
      }),
      await tx.post.count({
        where: {
          status: Status.ARCHIVED,
        },
      }),
      await tx.comment.count(),
      await tx.comment.count({
        where: {
          status: CommentStatus.APPROVED,
        },
      }),
      await tx.user.count(),
      await tx.user.count({
        where: {
          role: "ADMIN",
        },
      }),
      await tx.user.count({
        where: {
          role: "USER",
        },
      }),
      await tx.post.aggregate({
        _sum: {
          views: true,
        },
      }),
    ]);
    return {
      totalPosts,
      totalPublishedPosts,
      totalDraftPosts,
      totalArchivedPosts,
      totalComment,
      approvedComment,
      totalUsers,
      adminCount,
      userCount,
      totalViews: totalViews._sum.views || 0,
    };
  });
};
export const postService = {
  createPost,
  getAllPosts,
  getPostById,
  getMyPosts,
  updateMyPost,
  deleteMyPost,
  getPostStatistics,
};
