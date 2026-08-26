import { createCommentPayload } from "./comment.interface";

const createComment = async (payload: createCommentPayload) => {};

const getCommentByAuthorId = async () => {};
const getCommentByCommentId = async () => {};
const updateComment = async () => {};
const deleteComment = async () => {};
const moderatedComment = async () => {};

export const commentService = {
  createComment,
  getCommentByAuthorId,
  getCommentByCommentId,
  updateComment,
  deleteComment,
  moderatedComment,
};
