import { JwtAuthGuard } from './jwt-auth.guard';
import { HttpStatus } from '@nestjs/common';
import { User, UserStatus } from '@prisma/client';
import { mockExecutionContext, mockUsers } from '../../utils/tests/utils';
import { Response } from "express";
import { AuthGuard } from "@nestjs/passport";

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(() => {
    guard = new JwtAuthGuard();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return false if super.canActivate returns false', async () => {
    jest.spyOn(guard, 'canActivate' as any).mockImplementationOnce(() => false);
    const context = mockExecutionContext();
    const result = await guard.canActivate(context);
    expect(result).toBe(false);
  });

  it('should return false if super.canActivate returns a rejected promise', async () => {
    const error = new Error('Test error');
    jest
      .spyOn(AuthGuard('jwt').prototype, 'canActivate' as any)
      .mockImplementationOnce(() => Promise.reject(error));
    const context = mockExecutionContext();
    const result = await guard.canActivate(context);
    expect(result).toBe(false);
  });

  it('should return true if user is active', async () => {
    const user: User = {
      ...mockUsers()[0],
      status: UserStatus.Active,
    };
    const context = mockExecutionContext(undefined, undefined, undefined, user);
    jest
      .spyOn(AuthGuard('jwt').prototype, 'canActivate' as any)
      .mockImplementationOnce(() => Promise.resolve(true));

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('should return false if user is active but super.canActivate returns false', async () => {
    const user: User = {
      ...mockUsers()[0],
      status: UserStatus.Active,
    };
    const context = mockExecutionContext(undefined, undefined, undefined, user);
    jest
      .spyOn(AuthGuard('jwt').prototype, 'canActivate' as any)
      .mockImplementationOnce(() => Promise.resolve(false));

    const result = await guard.canActivate(context);

    expect(result).toBe(false);
  });

  it('should return false and send unauthorized response if user is not active', async () => {
    const user: User = {
      ...mockUsers()[0],
      status: UserStatus.Blocked,
    };
    const context = mockExecutionContext(undefined, undefined, undefined, user);
    const httpArgumentsHost = context.switchToHttp();
    const response = httpArgumentsHost.getResponse() as jest.Mocked<Response>;

    jest
      .spyOn(AuthGuard('jwt').prototype, 'canActivate' as any)
      .mockImplementationOnce(() => Promise.resolve(true));

    const result = await guard.canActivate(context);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
    expect(response.json).toHaveBeenCalledWith({
      message: `Unauthorized (${user.status})`,
      statusCode: 401,
    });
    expect(response.send).toHaveBeenCalled();
    expect(result).toBe(false);
  });

  it('should return false for any other status from super.canActivate', async () => {
    jest
      .spyOn(AuthGuard('jwt').prototype, 'canActivate' as any)
      .mockImplementationOnce(() => 'some-other-status' as any);
    const context = mockExecutionContext();
    const result = await guard.canActivate(context);
    expect(result).toBe(false);
  });
});