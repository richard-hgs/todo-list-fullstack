
import { UsersService } from './users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaBaseService } from '../prisma/prisma-base.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { mockI18nService, mockPrismaQueries, mockUsers } from '../../utils/tests/utils';
import bcrypt from "bcrypt";
import { ConfigService } from "../config/config.service";
import { MailService } from "../mail/mail.service";
import { OtpService } from "../otp/otp.service";
import { I18nService } from "nestjs-i18n";
import { ResourcesService } from "../resources/resources.service";
import { HttpException } from "@nestjs/common";

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockImplementation((password) => `hashed(${password})`),
}));

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaBaseService;
  let resourcesService: ResourcesService;

  const mockUser = mockUsers()[0];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        ConfigService,
        OtpService,
        ResourcesService,
        {
          provide: PrismaBaseService,
          useValue: {
            $transaction: jest.fn().mockImplementation((fn) => fn()),
            user: mockPrismaQueries(),
            app: mockPrismaQueries(),
            userHasApps: mockPrismaQueries(),
            otp: {
              ...mockPrismaQueries(),
              create: jest.fn().mockResolvedValue({ code: "123456" })
            }
          },
        },
        {
          provide: MailService,
          useValue: {
            sendActivationCodeMail: jest.fn()
          }
        },
        {
          provide: I18nService,
          useValue: mockI18nService(() => resourcesService)
        }
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaBaseService>(PrismaBaseService);
    resourcesService = module.get<ResourcesService>(ResourcesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user', async () => {
    const createUserDto: CreateUserDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'test-password',
      passwordConfirm: 'test-password',
    };

    const {passwordConfirm, ...calledCreateUserDto} = createUserDto;

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10); // Assuming roundsOfHashing is 10
    const createdUser = { ...calledCreateUserDto, password: hashedPassword };
    (prisma.user.create as jest.Mock).mockResolvedValueOnce(createdUser);
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(createdUser);

    const result = await service.create(createUserDto);

    expect(prisma.user.findUnique).toHaveBeenCalled();
    expect(prisma.user.create).toHaveBeenCalledWith({ data: createdUser });
    expect(result).toEqual(createdUser);
  });

  it('should find all users', async () => {
    (prisma.user.findMany as jest.Mock).mockResolvedValueOnce([mockUser]);
    const result = await service.findAll();
    expect(prisma.user.findMany).toHaveBeenCalled();
    expect(result).toEqual([mockUser]);
  });

  it('should find a user by ID', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(mockUser);
    const result = await service.findOneById(mockUser.id);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: mockUser.id } });
    expect(result).toEqual(mockUser);
  });

  it('should find a user by Email', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(mockUser);
    const result = await service.findOneByEmail(mockUser.email);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: mockUser.email } });
    expect(result).toEqual(mockUser);
  });

  it('should update a user', async () => {
    const updateUserDto: UpdateUserDto = {
      name: 'Updated Name',
    };

    const updatedUser = { ...mockUser, ...updateUserDto };
    (prisma.user.update as jest.Mock).mockResolvedValueOnce(updatedUser);
    const result = await service.update(mockUser.id, updateUserDto);

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: mockUser.id },
      data: updateUserDto,
    });
    expect(result).toEqual(updatedUser);
  });

  it('should update a user with a new hashed password', async () => {
    const updateUserDto: UpdateUserDto = {
      password: 'new-password',
    };

    const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
    const updatedUser = { ...mockUser, password: hashedPassword };
    (prisma.user.update as jest.Mock).mockResolvedValueOnce(updatedUser);

    const result = await service.update(mockUser.id, updateUserDto);

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: mockUser.id },
      data: { password: hashedPassword }, // Ensure only password is updated
    });
    expect(result).toEqual(updatedUser);
  });

  it('should remove a user', async () => {
    (prisma.user.delete as jest.Mock).mockResolvedValueOnce(mockUser);
    const result = await service.remove(mockUser.id);
    expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: mockUser.id } });
    expect(result).toEqual(mockUser);
  });
});