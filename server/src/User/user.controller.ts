import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ZodValidationPipe } from 'src/Pipes/validation.pipe';
import { UserService } from './user.service';
import {
  changePasswordSchema,
  signinSchema,
  signupSchema,
} from './user.validationSchema';
import { ChangePasswordDto, SignInDto, SignUpDto } from './dto';
import {
  ChangePasswordResponse,
  ProfileResponse,
  RequestWithUser,
  SignInResponse,
  SignUpResponse,
} from './interfaces';
import { AuthGuard } from '../Guards';
import { imageFileInterceptor } from '../common/cloudinary/FileInterceptor';
import { GetPostsResponseInterface } from '../Post/interfaces';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ============ Sign Up User Route ============

  @Post('signup')
  @UsePipes(new ZodValidationPipe(signupSchema))
  async signUpHandler(
    @Body() body: SignUpDto,
    @Res() res: Response,
  ): Promise<Response<SignUpResponse>> {
    const response: SignUpResponse = await this.userService.signUp(body);
    return res.status(201).json({ response });
  }

  // ============  Signin User Route ============
  @Post('signin')
  @UsePipes(new ZodValidationPipe(signinSchema))
  async signInHandler(
    @Body() body: SignInDto,
    @Res() res: Response,
  ): Promise<Response<SignInResponse>> {
    const response: SignInResponse = await this.userService.signIn(body);
    return res.status(200).json({ response });
  }

  // ============  Profile User Route ============
  @Get('profile')
  @UseGuards(AuthGuard)
  async profileHandler(
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ): Promise<Response<ProfileResponse>> {
    const response: ProfileResponse = await this.userService.profile(req);
    return res.status(200).json({ response });
  }
  // ============ Upload Profile Image Route ============
  @Put('image-upload')
  @UseGuards(AuthGuard)
  @UseInterceptors(imageFileInterceptor)
  async uploadProfileImage(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Response> {
    return this.userService.uploadProfileImage(req, file);
  }

  // ============ Get User Posts Route ============
  @Get('posts')
  @UseGuards(AuthGuard)
  async getUserPosts(@Req() req: Request): Promise<GetPostsResponseInterface> {
    return this.userService.getUserPosts(req);
  }

  // ============ Change Password Route ============
  @Put('change-password')
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(changePasswordSchema))
  async changePassword(
    @Req() req: Request,
    @Body() body: ChangePasswordDto,
  ): Promise<ChangePasswordResponse> {
    return this.userService.changePassword(req, body);
  }
}
