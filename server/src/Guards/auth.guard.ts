import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // check if there is a token in headers
    const { token } = request.headers;
    if (!token) throw new BadRequestException('Token not found');
    // check token prefix
    if (!token.startsWith(process.env.PREFIX))
      throw new BadRequestException('Invalid token');
    // split token
    const originalToken = token.split(' ')[1];
    // decode
    const data = this.jwtService.verify(originalToken, {
      secret: process.env.LOGIN_SECRET,
    });

    if (!data.id) throw new BadRequestException('Invalid token');
    // find user in db
    const user = await this.userModel.findById(data.id);
    if (!user) throw new BadRequestException('Please login first');
    // inject userData in request
    request.authUser = user;
    return true;
  }
}
