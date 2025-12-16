import {
  Injectable,
  CanActivate,
  ExecutionContext,
  // BadGatewayException,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const allowedRoles = this.reflector.get(Roles, context.getHandler());
    if (!allowedRoles) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const user = request['authUser'];
    console.log(allowedRoles);

    if (!user) {
      throw new BadRequestException('please login');
    }
    if (!allowedRoles.includes(user.role)) {
      throw new BadRequestException('you are not authorized');
    }
    return true;
  }
}
