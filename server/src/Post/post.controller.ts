import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { AuthGuard } from '../Guards';
import { imageFileInterceptor } from '../common/cloudinary/FileInterceptor';
import { CreatePostDto, UpdatePostDto } from './dto';
import {
  GetPostsResponseInterface,
  LikeResponseInterface,
  PostResponseInterface,
} from './interfaces';
import { Request } from 'express';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // ============ Create Post Route ============
  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(imageFileInterceptor)
  async createPost(
    @Body() body: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ): Promise<PostResponseInterface> {
    return this.postService.createPost(body, req, file);
  }

  // ============ Get Post Route ============
  @Get(':id')
  @UseGuards(AuthGuard)
  async getPost(@Param('id') id: string): Promise<PostResponseInterface> {
    return this.postService.getPost(id);
  }

  // ============ Get Posts Route ============
  @Get()
  @UseGuards(AuthGuard)
  async getPosts(): Promise<GetPostsResponseInterface> {
    return this.postService.getPosts();
  }

  // ============ Update Post Route ============
  @Put(':postId')
  @UseGuards(AuthGuard)
  @UseInterceptors(imageFileInterceptor)
  async updatePost(
    @Param('postId') postId: string,
    @Body() body: UpdatePostDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ): Promise<PostResponseInterface> {
    return this.postService.updatePost(postId, body, req, file);
  }

  // ============ Delete Post Route ============
  @Delete(':postId')
  @UseGuards(AuthGuard)
  async deletePost(
    @Param('postId') postId: string,
    @Req() req: Request,
  ): Promise<{ message: string }> {
    return this.postService.deletePost(postId, req);
  }

  // ============ Toggle Like Route ============
  @Post('toggle-like/:postId')
  @UseGuards(AuthGuard)
  async toggleLikePost(
    @Param('postId') postId: string,
    @Req() req: Request,
  ): Promise<LikeResponseInterface> {
    return this.postService.toggleLikePost(postId, req);
  }

  // ============ Share Post Route ============
  @Post('share/:postId')
  @UseGuards(AuthGuard)
  async sharePost(
    @Param('postId') postId: string,
    @Req() req: Request,
  ): Promise<any> {
    return this.postService.sharePost(postId, req);
  }
}
