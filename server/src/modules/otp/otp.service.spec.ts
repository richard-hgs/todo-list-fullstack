import { OtpService } from './otp.service';
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaBaseService } from "../prisma/prisma-base.service";
import { ConfigService } from "../config/config.service";
import { ResourcesService } from "../resources/resources.service";
import { mockI18nService, mockOtp, mockPrismaQueries, mockResourcesService, mockUsers } from "../../utils/tests/utils";
import { I18nService } from "nestjs-i18n";
import { BadRequestException } from "@nestjs/common";
import { VerifyOtpDto } from "./dto/verify-otp.dto";
import moment from "moment/moment";
import { OtpUseCase } from "@prisma/client";
import { UsersService } from "../users/users.service";
import { MailService } from "../mail/mail.service";
import { ResendOtpDto } from "./dto/resend-otp.dto";

describe('OtpService', () => {
  let service: OtpService;
  let resourcesService: ResourcesService;
  let i18nService: I18nService;
  let mailService: MailService;
  let prisma: PrismaBaseService;

  beforeEach(async () => {
    resourcesService = await mockResourcesService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OtpService,
        UsersService,
        ConfigService,
        MailService,
        ResourcesService,
        {
          provide: PrismaBaseService,
          useValue: {
            otp: {
              ...mockPrismaQueries(),
              findFirst: jest.fn().mockReturnValue({
                id       : 1,
                userId   : 1,
                code     : "123456",
                createdAt: new Date(),
                updatedAt: new Date(),
                expiresAt: moment().add(5, "m").toDate(),
                useCase  : OtpUseCase.AccountActivation
              })
            },
            user: mockPrismaQueries()
          }
        },
        {
          provide: I18nService,
          useValue: mockI18nService(() => resourcesService)
        }
      ],
    }).compile();

    prisma = module.get<PrismaBaseService>(PrismaBaseService);
    service = module.get<OtpService>(OtpService);
    i18nService = module.get<I18nService>(I18nService);
    mailService = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call verifyOtp for account activation and should throw otp not found error', async () => {
    const otpDto: VerifyOtpDto = {
      userId: 1,
      otpCode: '123456',
      otpUseCase: OtpUseCase.AccountActivation
    };

    (prisma.otp.findFirst as jest.Mock).mockReturnValue(null);
    const resp = service.validate(otpDto.userId, otpDto.otpCode);
    await expect(resp).rejects.toThrow(new BadRequestException(i18nService.t("errors.unable_to_validate_otp_code")));
  });

  it('should call verifyOtp for account activation and should throw otp expired', async () => {
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
      expiresAt: moment().subtract(1, "s").toDate(),
      useCase  : OtpUseCase.AccountActivation
    });
    const resp = service.validate(otpDto.userId, otpDto.otpCode);
    await expect(resp).rejects.toThrow(new BadRequestException(i18nService.t("errors.otp_code_expired")));
  });


  it('should call resendOtp for account activation and should succeed', async () => {
    const otpDto: ResendOtpDto = {
      userEmail : "testes@testes.com",
      otpUseCase: OtpUseCase.AccountActivation
    };

    const user = mockUsers().find(() => true);
    const otp = mockOtp().find(() => true);

    // noinspection DuplicatedCode
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
    (prisma.otp.findFirst as jest.Mock).mockResolvedValue(otp);
    (prisma.otp.findUnique as jest.Mock).mockResolvedValue(otp);
    (prisma.otp.create as jest.Mock).mockResolvedValue(otp);
    // Mock the transporter's sendMail method
    mailService.transporter.sendMail = jest.fn().mockResolvedValueOnce({} as any);

    await service.resendOtp(otpDto.userEmail, otpDto.otpUseCase);

    expect(mailService.transporter.sendMail).toHaveBeenCalledWith({
      from: "TodoList <dev@todolist.com.br>",
      to: `${user.name} <${user.email}>`,
      subject: `${i18nService.t("all.app.name")} - ${i18nService.t("mail.activate_account.title")}`,
      html: expect.any(String),
      text: expect.any(String)
    });
  });

  it('should call resendOtp for unknown user', async () => {
    const otpDto: ResendOtpDto = {
      userEmail : "unknown@testes.com",
      otpUseCase: OtpUseCase.AccountActivation
    };

    const otp = mockOtp().find(() => true);

    // noinspection DuplicatedCode
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.otp.findFirst as jest.Mock).mockResolvedValue(otp);
    (prisma.otp.findUnique as jest.Mock).mockResolvedValue(otp);
    (prisma.otp.create as jest.Mock).mockResolvedValue(otp);
    // Mock the transporter's sendMail method
    mailService.transporter.sendMail = jest.fn().mockResolvedValueOnce({} as any);

    await expect(service.resendOtp(otpDto.userEmail, otpDto.otpUseCase)).rejects.toThrow("User not found");
  });
});