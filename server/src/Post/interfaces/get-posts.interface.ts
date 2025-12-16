import { Types } from 'mongoose';

export interface GetPostsResponseInterface {
  message: string;
  posts: PostsResponse[];
}

export interface PostsResponse {
  _id: string | Types.ObjectId;
  body?: string;
  owner: string;
  image?: ImagePost;
  customId?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface ImagePost {
  url: string;
  public_id: string;
}

export interface LikeResponseInterface {
  message: string;
  likesCount: number;
  isLiked: boolean;
}
