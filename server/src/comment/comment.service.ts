import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Comment, Post } from '../schemas';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service';
import { CreateCommentDto } from './dto';
import { CreateCommentResponse } from './interfaces';
import { nanoid } from 'nanoid';
import { UploadApiResponse } from 'cloudinary';
import { Request } from 'express';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(Post.name) private postModel: Model<Post>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // =============== create comment api ===============

  async createComment(
    body: CreateCommentDto,
    req: Request,
    file: Express.Multer.File,
    postId: string,
  ): Promise<CreateCommentResponse> {
    const { _id } = req['authUser'];
    const { text } = body;
    if (!text && !file) throw new BadRequestException('Write something first');

    // Uploading image
    let imageData = null;
    let customId: string;
    if (file) {
      try {
        customId = nanoid(6);
        const folderPath: string = `${process.env.UPLOADS_FOLDER}/SocialApp/Comments/${customId}`;
        const result = (await this.cloudinaryService.uploadFile(file, {
          folder: folderPath,
        })) as UploadApiResponse;

        imageData = {
          url: result.secure_url,
          public_id: result.public_id,
        };
      } catch (err) {
        throw new BadRequestException('Image upload failed', err.message);
      }
    }

    // creating comment
    const comment = await this.commentModel.create({
      text,
      owner: _id,
      post: postId,
      ...(imageData && { image: imageData }),
      customId,
    });

    const post = await this.postModel.findById(postId);
    post.comments.push(comment._id);
    await post.save();

    return {
      message: 'success',
      comment,
    };
  }

  // =============== Update comment api ===============
  async updateComment(
    body: CreateCommentDto,
    req: Request,
    file: Express.Multer.File,
    commentId: string,
  ): Promise<CreateCommentResponse> {
    const { _id } = req['authUser'];
    const { text, removeImage } = body;

    // Find comment and throw error if not found
    const comment = await this.commentModel.findOne({
      _id: commentId,
      owner: _id,
    });
    if (!comment)
      throw new NotFoundException('Comment not found or you are not the owner');

    // Throw error if nothing to update
    if (text === undefined && !file && removeImage !== 'true')
      throw new BadRequestException('Write something first');

    // Remove image from cloudinary if exists and removeImage is true
    if (removeImage === 'true' && comment.image?.public_id) {
      await this.cloudinaryService.deleteFolderWithResources(
        `${process.env.UPLOADS_FOLDER}/SocialApp/Comments/${comment.customId}`,
      );
      comment.image = null;
      comment.customId = null;
    }

    // --------- UPDATE TEXT ---------
    if (text !== undefined) comment.text = text;

    // --------- Update image if exists ---------
    if (file) {
      //  if comment has no customId generate one
      if (!comment.customId) {
        comment.customId = nanoid(6);
      }

      let publicIdName = undefined;

      //  If image existed extract image name from URL
      if (comment.image?.public_id) {
        publicIdName = comment.image.public_id.split(`${comment.customId}/`)[1];
      }

      const uploaded = await this.cloudinaryService.uploadFile(file, {
        folder: `${process.env.UPLOADS_FOLDER}/SocialApp/Comments/${comment.customId}`,
        public_id: publicIdName,
        overwrite: true,
      });

      comment.image = {
        url: uploaded.secure_url,
        public_id: uploaded.public_id,
      };
    }

    // ----- Save comment and return -----
    await comment.save();

    return {
      message: 'success',
      comment,
    };
  }
  // =============== delete comment api ===============

  async deleteComment(
    commentId: string,
    req: Request,
  ): Promise<{ message: string }> {
    const { _id } = req['authUser'];

    const deleteComment = await this.commentModel.findOneAndDelete({
      _id: commentId,
      owner: _id,
    });
    if (!deleteComment) throw new NotFoundException('Something went wrong');

    // Delete image from Cloudinary if exists
    const folderPath = `${process.env.UPLOADS_FOLDER}/SocialApp/Comments/${deleteComment.customId}`;

    if (deleteComment.image) {
      await this.cloudinaryService.deleteFolderWithResources(folderPath);
    }

    // Remove the comment reference from the related post

    await this.postModel.findOneAndUpdate(
      { _id: deleteComment.post },
      { $pull: { comments: commentId } },
    );

    return {
      message: 'success',
    };
  }
}
