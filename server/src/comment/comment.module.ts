import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { JwtService } from '@nestjs/jwt';
import { CommentModel, PostModel, userModel } from '../schemas';
import { CloudinaryModule } from '../common/cloudinary/cloudinary.module';

@Module({
  imports: [CommentModel, userModel, PostModel, CloudinaryModule],
  controllers: [CommentController],
  providers: [CommentService, JwtService],
})
export class CommentModule {}
