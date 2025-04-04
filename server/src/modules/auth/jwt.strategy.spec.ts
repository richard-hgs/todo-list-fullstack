import { JwtStrategy } from './jwt.strategy';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { UnauthorizedException } from '@nestjs/common';
import { mockUsers } from '../../utils/tests/utils';
import { ConfigService } from "../config/config.service";

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: UsersService,
          useValue: {
            findOneById: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            getEnv: jest.fn().mockReturnValue("test-secret")
          }
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should validate JWT and return user if found', async () => {
    const user = mockUsers()[0];
    (usersService.findOneById as jest.Mock).mockReturnValueOnce(user);

    const payload = { userId: user.id };
    const validatedUser = await strategy.validate(payload);

    expect(usersService.findOneById).toHaveBeenCalledWith(payload.userId);
    expect(validatedUser).toEqual(user);
  });

  it('should throw UnauthorizedException if user not found', async () => {
    (usersService.findOneById as jest.Mock).mockReturnValueOnce(null);

    const payload = { userId: 123 };
    await expect(strategy.validate(payload)).rejects.toThrow(UnauthorizedException);
    expect(usersService.findOneById).toHaveBeenCalledWith(payload.userId);
  });
});