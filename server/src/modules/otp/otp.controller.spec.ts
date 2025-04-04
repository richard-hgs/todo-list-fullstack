import { VerifyOtpDto } from "./dto/verify-otp.dto";
import { OtpUseCase, UserStatus } from "@prisma/client";
import moment from "moment/moment";
import { BadRequestException, HttpException, HttpStatus } from "@nestjs/common";
import { ResourcesService } from "../resources/resources.service";
import { I18nService } from "nestjs-i18n";
import {
  mockExecutionContext,
  mockI18nService,
  mockOtp,
  mockPrismaQueries,
  mockUsers
} from "../../utils/tests/utils";
import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "../config/config.service";
import { OtpService } from "./otp.service";
import { UsersService } from "../users/users.service";
import { MailService } from "../mail/mail.service";
import { PrismaBaseService } from "../prisma/prisma-base.service";
import { OtpController } from "./otp.controller";
import { ResendOtpDto } from "./dto/resend-otp.dto";


describe("OtpController", () => {
  let controller: OtpController;
  let resourcesService: ResourcesService;
  let otpService: OtpService;
  let i18nService: I18nService;
  let mailService: MailService;
  let prisma: PrismaBaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OtpController],
      providers: [
        ConfigService,
        OtpService,
        UsersService,
        MailService,
        ResourcesService,
        {
          provide: PrismaBaseService,
          useValue: {
            user: {
              ...mockPrismaQueries(),
              findUnique: jest.fn((args: { where: { email: string, id: number } }) => {
                const {where: { email, id }} = args;
                return mockUsers().find((user) => user.email === email || user.id === id);
              }),
              update: jest.fn(),
              create: jest.fn().mockReturnValue({
              }),
            },
            otp: {
              ...mockPrismaQueries(),
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
            },
            userHasApps: mockPrismaQueries()
          }
        },
        {
          provide: I18nService,
          useValue: mockI18nService(() => resourcesService)
        }
      ],
    }).compile();

    prisma = module.get<PrismaBaseService>(PrismaBaseService);
    controller = module.get<OtpController>(OtpController);
    resourcesService = module.get<ResourcesService>(ResourcesService);
    otpService = module.get<OtpService>(OtpService);
    i18nService = module.get<I18nService>(I18nService);
    mailService = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call verifyOtp for account activation with correct parameters', async () => {
    const otpDto: VerifyOtpDto = {
      userId: 1,
      otpCode: '123456',
      otpUseCase: OtpUseCase.AccountActivation
    };
    const verifyOtpSpy = jest.spyOn(otpService, 'verifyOtp');
    await controller.verifyOtp(otpDto);

    expect(verifyOtpSpy).toHaveBeenCalledWith(otpDto.userId, otpDto.otpCode, otpDto.otpUseCase);
  });

  it('should call verifyOtp for account activation with invalid useCase', async () => {
    const otpDto: VerifyOtpDto = {
      userId: 1,
      otpCode: '123456',
      otpUseCase: OtpUseCase.AccountActivation
    };

    (prisma.otp.findFirst as jest.Mock).mockReturnValue({
      id       : 1,
      userId   : 1,
      code     : "123456",
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt: moment().add(5, "m").toDate(),
      useCase  : -1
    });

    const response = controller.verifyOtp(otpDto);
    await expect(response).rejects.toThrow(new BadRequestException(i18nService.t("errors.invalid_otp_use_case")));
  });

  it('should call verifyOtp for account activation and should throw user not found', async () => {
    const otpDto: VerifyOtpDto = {
      userId: 1,
      otpCode: '123456',
      otpUseCase: OtpUseCase.AccountActivation
    };

    (prisma.otp.findFirst as jest.Mock).mockReturnValue({
      id       : 1,
      userId   : 1,
      code     : "123456",
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt: moment().add(5, "m").toDate(),
      useCase  : -1
    });
    (prisma.user.findUnique as jest.Mock).mockReturnValue(undefined);

    const response = controller.verifyOtp(otpDto);
    await expect(response).rejects.toThrow(new HttpException("User not found.", 400));
  });

  it('should call verifyOtp for account activation and should throw user blocked', async () => {
    const otpDto: VerifyOtpDto = {
      userId: 1,
      otpCode: '123456',
      otpUseCase: OtpUseCase.AccountActivation
    };

    (prisma.otp.findFirst as jest.Mock).mockReturnValue({
      id       : 1,
      userId   : 1,
      code     : "123456",
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt: moment().add(5, "m").toDate(),
      useCase  : -1
    });
    (prisma.user.findUnique as jest.Mock).mockReturnValue({
      ...mockUsers()[0],
      isEmailActivated: false,
      status: UserStatus.Blocked
    });

    const response = controller.verifyOtp(otpDto);
    await expect(response).rejects.toThrow(new HttpException(`Unable to verify OTP. User is ${UserStatus.Blocked}`, 400));
  });

  it('should call resendOtp for account activation with correct parameters', async () => {
    const otpDto: ResendOtpDto = {
      userEmail : "testes@testes.com",
      otpUseCase: OtpUseCase.AccountActivation
    };

    const user = mockUsers().find(() => true);
    const otp = mockOtp().find(() => true);

    const context = mockExecutionContext();
    const request = context.switchToHttp();
    const response = request.getResponse();

    const resendOtpSpy = jest.spyOn(otpService, 'resendOtp');

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
    (prisma.otp.findFirst as jest.Mock).mockResolvedValue(otp);
    (prisma.otp.findUnique as jest.Mock).mockResolvedValue(otp);
    (prisma.otp.create as jest.Mock).mockResolvedValue(otp);
    // Mock the transporter's sendMail method
    mailService.transporter.sendMail = jest.fn().mockResolvedValueOnce({} as any);

    await controller.resendOtp(otpDto, response);

    expect(resendOtpSpy).toHaveBeenCalledWith(otpDto.userEmail, otpDto.otpUseCase);
    expect(response.status).toBeCalledWith(HttpStatus.OK);
    expect(mailService.transporter.sendMail).toHaveBeenCalledWith({
      from: "TodoList <dev@todolist.com.br>",
      to: `${user.name} <${user.email}>`,
      subject: `${i18nService.t("all.app.name")} - ${i18nService.t("mail.activate_account.title")}`,
      html: expect.any(String),
      text: expect.any(String)
    });
  });
});