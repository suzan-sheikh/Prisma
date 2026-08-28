import { PostStatus } from "../../../generated/prisma/enums";

export interface ICreatePostPayload {
  id: string;
  title: string;
  content: string;
  thumbnail?: string;
  isFeatured?: boolean;
  status?: PostStatus;
  tag: string[];
}

export interface IUpdatePostPayload {
  title?: string;
  content?: string;
  thumbnail?: string;
  isFeatured?: boolean;
  status?: PostStatus;
  tag?: string[];
}