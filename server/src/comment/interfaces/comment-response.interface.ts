import { Types } from 'mongoose';

export interface CreateCommentResponse {
  message: string;
  comment: CommentResponse;
}

export interface CommentResponse {
  _id: string | Types.ObjectId;
  text?: string;
  owner: string;
  post: string;
  image?: ImageComment;
  customId?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface ImageComment {
  url: string;
  public_id: string;
}
