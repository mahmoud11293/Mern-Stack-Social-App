import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { CommentModel, PostModel, userModel } from '../schemas';
import { JwtService } from '@nestjs/jwt';
import { CloudinaryModule } from '../common/cloudinary/cloudinary.module';

@Module({
  imports: [PostModel, userModel, CommentModel, CloudinaryModule],
  controllers: [PostController],
  providers: [PostService, JwtService],
})
export class PostModule {}
