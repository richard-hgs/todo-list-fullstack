import { createParamDecorator, ExecutionContext, UnauthorizedException } from "@nestjs/common";


export const UserParam = createParamDecorator(
  async (data, ctx: ExecutionContext) => {
    const http = ctx.switchToHttp();
    const request = http.getRequest();
    return request.user;
  }
)