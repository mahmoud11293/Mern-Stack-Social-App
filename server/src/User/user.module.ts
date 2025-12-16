import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PostModel, userModel } from '../schemas';
import { JwtService } from '@nestjs/jwt';
import { CloudinaryModule } from '../common/cloudinary/cloudinary.module';

@Module({
  imports: [userModel, PostModel, CloudinaryModule],
  controllers: [UserController],
  providers: [UserService, JwtService],
})
export class UserModule {}
