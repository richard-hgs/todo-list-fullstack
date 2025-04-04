import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from "./dto/login.dto";
import { PrismaBaseService } from "../prisma/prisma-base.service";
import { JwtService } from "@nestjs/jwt";
import { NotFoundException, UnauthorizedException } from "@nestjs/common";
import { mockAccessToken, mockI18nService, mockUsers } from "../../utils/tests/utils";
import { ConfigService } from "../config/config.service";
import { OtpService } from "../otp/otp.service";
import { UsersService } from "../users/users.service";
import { MailService } from "../mail/mail.service";
import { ResourcesService } from "../resources/resources.service";
import { I18nService } from "nestjs-i18n";
import moment from "moment";
import { OtpUseCase, UserStatus } from "@prisma/client";

describe('AuthController', () => {
  let controller: AuthController;
  let resourcesService: ResourcesService;
  let authService: AuthService;
  let i18nService: I18nService;
  let prisma: PrismaBaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        ConfigService,
        OtpService,
        UsersService,
        MailService,
        ResourcesService,
        {
          provide: PrismaBaseService,
          useValue:  {
            user: {
              findUnique: jest.fn((args: { where: { email: string } }) => {
                const {where: { email }} = args;
                return mockUsers().find((user) => user.email === email);
              }),
              update: jest.fn()
            },
            otp: {
              findFirst: jest.fn().mockReturnValue({
                id: 1,
                userId: 1,
                code: "123456",
                createdAt: new Date(),
                updatedAt: new Date(),
                expiresAt: moment().add(5, "m").toDate(),
                useCase: OtpUseCase.AccountActivation
              }),
              delete: jest.fn()
            }
          }
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue(mockAccessToken())
          }
        },
        {
          provide: I18nService,
          useValue: mockI18nService(() => resourcesService)
        }
      ],
    }).compile();

    prisma = module.get<PrismaBaseService>(PrismaBaseService);
    controller = module.get<AuthController>(AuthController);
    resourcesService = module.get<ResourcesService>(ResourcesService);
    authService = module.get<AuthService>(AuthService);
    i18nService = module.get<I18nService>(I18nService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('login user not found', async () => {
    const body = {
      email: "testes@notregistered.com",
      password: "12345678"
    } as LoginDto;

    await expect(controller.login(body)).rejects.toThrow(
      new NotFoundException(`No user found for email: ${body.email}`)
    )
  })

  it('login user email not activated', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
      ...mockUsers()[0],
      status: UserStatus.Pending,
      isEmailActivated: false
    });

    const body = {
      email: "testes@testes.com",
      password: "1234567"
    } as LoginDto;

    await expect(controller.login(body)).rejects.toThrow(
      new UnauthorizedException('User email not activated.')
    )
  })

  it('login user blocked', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
      ...mockUsers()[0],
      status: UserStatus.Blocked,
      isEmailActivated: true
    });

    const body = {
      email: "testes@testes.com",
      password: "1234567"
    } as LoginDto;

    await expect(controller.login(body)).rejects.toThrow(
      new UnauthorizedException(`User status is ${UserStatus.Blocked}.`)
    )
  })

  it('login user wrong password', async () => {
    const body = {
      email: "testes@testes.com",
      password: "1234567"
    } as LoginDto;

    await expect(controller.login(body)).rejects.toThrow(
      new UnauthorizedException('Invalid password')
    )
  })

  it('login user success', async () => {
    const body = {
      email: "testes@testes.com",
      password: "12345678"
    } as LoginDto;

    await expect(controller.login(body)).resolves.toEqual({
      accessToken: mockAccessToken()
    });
  })
});