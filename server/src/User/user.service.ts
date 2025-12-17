import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Post, User } from '../schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChangePasswordDto, SignInDto, SignUpDto } from './dto';
import {
  ChangePasswordResponse,
  ProfileResponse,
  RequestWithUser,
  SignInResponse,
  SignUpResponse,
} from './interfaces';
import { compareSync, hashSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { nanoid } from 'nanoid';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service';
import { UploadApiResponse } from 'cloudinary';
import { GetPostsResponseInterface } from '../Post/interfaces';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userMode: Model<User>,
    @InjectModel(Post.name) private postMode: Model<Post>,
    private jwtService: JwtService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
  // ============ Sign Up API ============
  async signUp(body: SignUpDto): Promise<SignUpResponse> {
    const { name, email, password, dateOfBirth, gender }: SignUpDto = body;

    const isEmailExist: User = await this.userMode.findOne({ email });
    // check if email exist
    if (isEmailExist) {
      throw new ConflictException('Email already exist');
    }
    // Hashing password
    const hash: string = hashSync(password, +process.env.SALT);
    // Prepare User Object
    const newUser = new this.userMode({
      name,
      email,
      password: hash,
      dateOfBirth,
      gender,
    });
    const user: User = await newUser.save();
    return {
      message: 'success',
      user,
    };
  }

  // ============ Sign In API ============
  async signIn(body: SignInDto): Promise<SignInResponse> {
    const { email, password }: SignInDto = body;

    const user = await this.userMode.findOne({ email });
    // check if user exist
    if (!user) {
      throw new ConflictException('invalid credentials');
    }
    // check if password is correct
    const isPasswordCorrect: boolean = compareSync(password, user.password);
    if (!isPasswordCorrect) {
      throw new ConflictException('invalid credentials');
    }

    // generate token
    const token: string = this.jwtService.sign(
      { id: user._id },
      { secret: process.env.LOGIN_SECRET, expiresIn: '1d' },
    );

    return {
      message: 'success',
      token,
    };
  }
  // ============ Upload image Profile API ============
  async uploadProfileImage(
    req: Request,
    file: Express.Multer.File,
  ): Promise<any> {
    const { _id } = req['authUser'];
    // find user
    const user = await this.userMode.findById(_id);
    if (!user) throw new NotFoundException('user not found');

    // upload the profile image to cloudinary
    const customId = nanoid(4);
    const folderPath: string = `${process.env.UPLOADS_FOLDER}/SocialApp/ImageProfile/${customId}`;
    const result = (await this.cloudinaryService.uploadFile(file, {
      folder: folderPath,
    })) as UploadApiResponse;

    user.image = {
      url: result.secure_url,
      public_id: result.public_id,
    };
    user.customId = customId;
    await user.save();

    return {
      message: 'success',
    };
  }

  // ============ Profile API ============
  async profile(req: RequestWithUser): Promise<ProfileResponse> {
    const { _id } = req.authUser;
    const user: User = await this.userMode.findById(_id).select('-password');
    if (!user) throw new NotFoundException('user not found');
    return {
      message: 'success',
      user,
    };
  }
  // ============ Get User Posts API ============
  async getUserPosts(req: Request): Promise<GetPostsResponseInterface> {
    const { _id } = req['authUser'];
    const userPosts = await this.postMode
      .find({ owner: _id })
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
      posts: userPosts,
    };
  }

  // =========== Change Password API ============
  async changePassword(
    req: Request,
    body: ChangePasswordDto,
  ): Promise<ChangePasswordResponse> {
    const { _id } = req['authUser'];
    const { oldPassword, newPassword }: ChangePasswordDto = body;

    const user = await this.userMode.findById(_id);
    if (!user) return new NotFoundException('user not found');

    const isPasswordCorrect: boolean = compareSync(oldPassword, user.password);
    if (!isPasswordCorrect) {
      throw new ConflictException('invalid credentials');
    }

    if (compareSync(newPassword, user.password)) {
      throw new ConflictException('new password is same as old password');
    }

    user.password = hashSync(newPassword, +process.env.SALT);
    await user.save();

    return {
      message: 'success',
    };
  }
}
