import { ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from "express";
import { User, UserStatus } from "@prisma/client";

/**
 * JwtAuthGuard is a custom guard that protects routes using JWT authentication.
 *
 * It extends NestJS `AuthGuard` and uses the 'jwt' strategy,
 * which should correspond to the name you've given your JWT strategy
 * (likely `JwtStrategy` in your setup).
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const canActivateRes = super.canActivate(context);
      const httpCtx = context.switchToHttp();

      if (canActivateRes instanceof Promise) {
        const isActivate = await canActivateRes;
        if (isActivate) {
          const user = httpCtx.getRequest<Request>().user as User;
          if (user.status !== UserStatus.Active) {
            httpCtx.getResponse<Response>().status(HttpStatus.UNAUTHORIZED).json({
              message   : `Unauthorized (${user.status})`,
              statusCode: 401
            }).send();
            return false;
          } else {
            return isActivate;
          }
        } else {
          return false;
        }
      } else {
        // Should never get here, only if @nestjs/passport is updated in future versions
        return false;
      }
    } catch (e) {
      // TODO Log errors
      return false;
    }
  }
}