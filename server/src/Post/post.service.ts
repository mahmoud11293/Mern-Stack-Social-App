import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, Post } from '../schemas';
import { Model } from 'mongoose';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service';
import { CreatePostDto, UpdatePostDto } from './dto';
import {
  GetPostsResponseInterface,
  LikeResponseInterface,
  PostResponseInterface,
} from './interfaces';
import { nanoid } from 'nanoid';
import { UploadApiResponse } from 'cloudinary';
import { Request } from 'express';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // =============== create post api ===============
  async createPost(
    body: CreatePostDto,
    req: Request,
    file: Express.Multer.File,
  ): Promise<PostResponseInterface> {
    const { _id } = req['authUser'];
    const { body: postBody }: CreatePostDto = body;

    if (!postBody && !file) {
      throw new BadRequestException('Post must have text or image');
    }

    // Uploading image
    let imageData = null;
    let customId: string;
    if (file) {
      try {
        customId = nanoid(6);
        const folderPath: string = `${process.env.UPLOADS_FOLDER}/SocialApp/Posts/${customId}`;
        const result = (await this.cloudinaryService.uploadFile(file, {
          folder: folderPath,
        })) as UploadApiResponse;

        imageData = {
          url: result.secure_url,
          public_id: result.public_id,
        };
      } catch (err) {
        throw new BadRequestException('Image upload failed', err);
      }
    }

    // Creating post
    const post = await this.postModel.create({
      body: postBody,
      owner: _id,
      ...(imageData && { image: imageData }),
      customId,
    });
    return {
      message: 'success',
      post,
    };
  }

  // =============== get post api ===============
  async getPost(id: string): Promise<PostResponseInterface> {
    const post = await this.postModel
      .findById(id)
      .populate([
        { path: 'owner', select: '-password' },
        {
          path: 'comments',
          populate: { path: 'owner', select: '-password' },
          options: { sort: { createdAt: -1 } },
        },
        {
          path: 'sharedFrom',
          populate: { path: 'owner', select: '-password' },
        },
      ])
      .sort({ createdAt: -1 });

    return {
      message: 'success',
      post,
    };
  }

  // =============== get posts api ===============
  async getPosts(): Promise<GetPostsResponseInterface> {
    const posts = await this.postModel
      .find()
      .populate([
        { path: 'owner', select: '-password' },
        {
          path: 'comments',
          populate: { path: 'owner', select: '-password' },
          options: { sort: { createdAt: -1 } },
        },
        {
          path: 'sharedFrom',
          populate: { path: 'owner', select: '-password' },
        },
      ])
      .sort({ createdAt: -1 });

    return {
      message: 'success',
      posts,
    };
  }
  // =============== Update Post api ===============
  async updatePost(
    postId: string,
    body: UpdatePostDto,
    req: Request,
    file: Express.Multer.File,
  ): Promise<PostResponseInterface> {
    const { _id } = req['authUser'];
    const { body: postBody, removeImage }: UpdatePostDto = body;

    // Find post and throw error if not found
    const post = await this.postModel.findOne({ _id: postId, owner: _id });
    if (!post) throw new NotFoundException('Post not found');

    // Throw error if nothing to update
    if (postBody === undefined && !file && removeImage !== 'true') {
      throw new BadRequestException('Nothing to update');
    }

    // Update Text (Body)
    if (postBody !== undefined) {
      post.body = postBody;
    }

    // Remove image from cloudinary if exists and removeImage is true
    if (removeImage === 'true' && post.image?.public_id) {
      await this.cloudinaryService.deleteFolderWithResources(
        `${process.env.UPLOADS_FOLDER}/SocialApp/Posts/${post.customId}`,
      );
      post.image = null;
      post.customId = null;
    }

    if (file) {
      //  if post has no customId generate one
      if (!post.customId) {
        post.customId = nanoid(6);
      }

      let publicIdName = undefined;
      if (post.image?.public_id) {
        publicIdName = post.image.public_id.split(`${post.customId}/`)[1];
      }

      const uploaded = await this.cloudinaryService.uploadFile(file, {
        folder: `${process.env.UPLOADS_FOLDER}/SocialApp/Posts/${post.customId}`,
        public_id: publicIdName,
        overwrite: true,
      });
      post.image = {
        url: uploaded.secure_url,
        public_id: uploaded.public_id,
      };
    }

    // Save post updates to DB
    await post.save();

    return {
      message: 'success',
      post,
    };
  }

  // ============== Delete post api ===============
  async deletePost(postId: string, req: Request): Promise<{ message: string }> {
    const { _id } = req['authUser'];

    const deletePost = await this.postModel.findOneAndDelete({
      _id: postId,
      owner: _id,
    });

    if (!deletePost) throw new NotFoundException('Somthing went wrong');

    // Delete image from Cloudinary if exists
    const folderPath = `${process.env.UPLOADS_FOLDER}/SocialApp/Posts/${deletePost.customId}`;

    if (deletePost.image) {
      await this.cloudinaryService.deleteFolderWithResources(folderPath);
    }

    // Delete Comments from DB
    await this.commentModel.deleteMany({ post: deletePost._id });

    return {
      message: 'success',
    };
  }

  // ============== Toggle like api ===============
  async toggleLikePost(
    postId: string,
    req: Request,
  ): Promise<LikeResponseInterface> {
    const { _id: userId } = req['authUser'];

    const post = await this.postModel.findById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const likeIndex = post.likes.findIndex(
      (like) => like.toString() === userId.toString(),
    );

    let message: string;
    let isLiked: boolean;

    if (likeIndex === -1) {
      // Add like
      post.likes.push(userId);
      message = 'addedSuccessfully';
      isLiked = true;
    } else {
      // Remove like
      post.likes.splice(likeIndex, 1);
      message = 'removedSuccessfully';
      isLiked = false;
    }

    await post.save();

    // Populate likes count for response
    await post.populate('likes', '-password');

    return {
      message,
      likesCount: post.likes.length,
      isLiked,
    };
  }

  // ============== Share Post API ===============
  async sharePost(postId: string, req: Request) {
    const { _id: userId } = req['authUser'];

    // Get original post + populate owner
    const originalPost = await this.postModel
      .findById(postId)
      .populate('owner', '-password');

    if (!originalPost) {
      throw new NotFoundException('Original post not found');
    }

    // Create new Shared Post
    const sharedPost = await this.postModel.create({
      owner: userId,
      body: originalPost.body,
      image: originalPost.image || null,
      isShared: true,
      sharedFrom: originalPost._id,
    });

    // Populate shared post fully
    await sharedPost.populate('owner', '-password');
    await sharedPost.populate({
      path: 'sharedFrom',
      populate: {
        path: 'owner',
        select: '-password',
      },
    });

    return {
      message: 'Post shared successfully',
      post: sharedPost,
    };
  }
}
