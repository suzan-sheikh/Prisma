import { prisma } from "../../lib/prisma";
import { ICreatePostPayload, IUpdatePostPayload } from "./post.interface";

const createPost = async (payload: ICreatePostPayload, userId: string) => {
  const result = await prisma.post.create({
    data: {
      ...payload,
      authorId: userId,
    },
  });

  return result;
};

const getAllPosts = async () => {
  const posts = await prisma.post.findMany({
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });
  return posts;
};

const getPostsById = async (postId: string) => {
  const post = await prisma.post.findFirstOrThrow({
    where: { id: postId },
  });
  const updatedPost = await prisma.post.update({
    where: { id: postId },
    data: {
      views: {
        increment: 1,
      },
    },
    include: {
      author: {
        omit: { password: true },
      },
      comments: true,
    },
  });

  return updatedPost;
};

const getMyPost = async (authorId: string) => {
  const result = await prisma.post.findMany({
    where: {
      authorId,
    },
    orderBy: {
      createdAt: "asc",
    },

    include: {
      comments: true,
      author: {
        omit: { password: true },
      },
      _count: {
        select: { comments: true },
      },
    },
  });

  return result;
};

const updatePostById = async (
  postId: string,
  payload: IUpdatePostPayload,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findFirstOrThrow({
    where: { id: postId },
  });

  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("You are not the owner of this post!");
  }

  const result = await prisma.post.update({
    where: {
      id: postId,
    },
    data: payload,

    include: {
      comments: true,
      author: {
        omit: { password: true },
      }
    },

    //     include: {
    //   author: {
    //     omit: {
    //       password: true,
    //     },
    //   },
    //   comments: true,
    // },

  });
  return result

};

const deletePost = async () => {};

const getPostsStatus = async () => {};

export const postService = {
  createPost,
  getAllPosts,
  getPostsById,
  getMyPost,
  updatePostById,
  deletePost,
  getPostsStatus,
};
