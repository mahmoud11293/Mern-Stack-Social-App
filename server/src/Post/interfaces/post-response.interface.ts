import { Types } from 'mongoose';

export interface PostResponseInterface {
  message: string;
  post: PostResponse;
}

export interface PostResponse {
  _id: string | Types.ObjectId;
  body?: string;
  owner: string;
  image?: Image;
  customId?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface Image {
  url: string;
  public_id: string;
}
