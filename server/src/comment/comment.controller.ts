import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthGuard } from '../Guards';
import { imageFileInterceptor } from '../common/cloudinary/FileInterceptor';
import { CreateCommentResponse } from './interfaces';
import { CreateCommentDto } from './dto';
import { Request } from 'express';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // ============ Create Comment Route ============
  @Post(':postId')
  @UseGuards(AuthGuard)
  @UseInterceptors(imageFileInterceptor)
  async createComment(
    @Body() body: CreateCommentDto,
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
    @Param('postId') postId: string,
  ): Promise<CreateCommentResponse> {
    return this.commentService.createComment(body, req, file, postId);
  }

  // ============ Update Comment Route ============
  @Put(':commentId')
  @UseGuards(AuthGuard)
  @UseInterceptors(imageFileInterceptor)
  async updateComment(
    @Body() body: CreateCommentDto,
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
    @Param('commentId') commentId: string,
  ): Promise<CreateCommentResponse> {
    return this.commentService.updateComment(body, req, file, commentId);
  }

  // ============ Delete Comment Route ============
  @Delete(':commentId')
  @UseGuards(AuthGuard)
  async deleteComment(
    @Param('commentId') commentId: string,
    @Req() req: Request,
  ): Promise<{ message: string }> {
    return this.commentService.deleteComment(commentId, req);
  }
}
