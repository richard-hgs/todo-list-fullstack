import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UserEntity } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { mockBaseUsersService, mockI18nService, mockPrismaQueries, mockUsers } from '../../utils/tests/utils';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from "@prisma/client";
import { Request } from "express";
import { I18nService } from "nestjs-i18n";
import { ResourcesService } from "../resources/resources.service";
import { ConfigService } from "../config/config.service";

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;
  let resourcesService: ResourcesService;
  const i18nService = mockI18nService(() => resourcesService);

  const mockUser = mockUsers()[0];
  const mockRequest: Partial<Request> = {
    user: mockUser
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        ConfigService,
        ResourcesService,
        {
          provide: UsersService,
          useValue: mockBaseUsersService(),
        },
        {
          provide: I18nService,
          useValue: i18nService
        }
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
    resourcesService = module.get<ResourcesService>(ResourcesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'test-password',
        passwordConfirm: 'test-password'
      };
      const createdUser = { ...createUserDto };
      (usersService.create as jest.Mock).mockResolvedValueOnce(createdUser);

      const result = await controller.create(createUserDto);

      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(new UserEntity(createdUser));
    });

    it('should handle ConflictException gracefully', async () => {
      const createUserDto: CreateUserDto = {
        // ... user data
      } as unknown as CreateUserDto;
      (usersService.create as jest.Mock).mockRejectedValueOnce(new ConflictException());

      await expect(controller.create(createUserDto)).rejects.toThrow(ConflictException);
    });

    it('should handle other exceptions gracefully', async () => {
      const createUserDto: CreateUserDto = {
        // ... user data
      } as unknown as CreateUserDto;
      (usersService.create as jest.Mock).mockRejectedValueOnce(
        new InternalServerErrorException(),
      );

      await expect(controller.create(createUserDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findMe', () => {
    it('should find the current user', async () => {
      (usersService.findOneById as jest.Mock).mockResolvedValueOnce(mockRequest.user);

      const result = await controller.findMe(mockRequest as Request);

      expect(usersService.findOneById).toHaveBeenCalledWith((mockRequest.user as User).id);
      expect(result).toEqual(new UserEntity(mockRequest.user));
    });

    it('should handle exceptions gracefully', async () => {
      (usersService.findOneById as jest.Mock).mockRejectedValueOnce(
        new InternalServerErrorException(),
      );

      await expect(controller.findMe(mockRequest as Request)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      (usersService.findAll as jest.Mock).mockResolvedValueOnce([mockUser]);

      const result = await controller.findAll();

      expect(usersService.findAll).toHaveBeenCalled();
      expect(result).toEqual([new UserEntity(mockUser)]);
    });

    it('should handle exceptions gracefully', async () => {
      (usersService.findAll as jest.Mock).mockRejectedValueOnce(
        new InternalServerErrorException(),
      );

      await expect(controller.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findOne', () => {
    it('should find a user by ID', async () => {
      (usersService.findOneById as jest.Mock).mockResolvedValueOnce(mockUser);
      const result = await controller.findOne(mockUser.id);
      expect(usersService.findOneById).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(new UserEntity(mockUser));
    });

    it('should handle NotFoundException gracefully', async () => {
      (usersService.findOneById as jest.Mock).mockRejectedValueOnce(new NotFoundException());

      await expect(controller.findOne(123)).rejects.toThrow(NotFoundException);
    });

    it('should handle other exceptions gracefully', async () => {
      (usersService.findOneById as jest.Mock).mockRejectedValueOnce(
        new InternalServerErrorException(),
      );

      await expect(controller.findOne(123)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Updated Name',
      };
      const updatedUser = { ...mockUser, ...updateUserDto };
      (usersService.update as jest.Mock).mockResolvedValueOnce(updatedUser);

      const result = await controller.update(mockUser.id, updateUserDto);

      expect(usersService.update).toHaveBeenCalledWith(mockUser.id, updateUserDto);
      expect(result).toEqual(new UserEntity(updatedUser));
    });

    it('should handle NotFoundException gracefully', async () => {
      const updateUserDto: UpdateUserDto = {
        // ... user data
      };
      (usersService.update as jest.Mock).mockRejectedValueOnce(new NotFoundException());

      await expect(controller.update(123, updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle other exceptions gracefully', async () => {
      const updateUserDto: UpdateUserDto = {
        // ... user data
      };
      (usersService.update as jest.Mock).mockRejectedValueOnce(
        new InternalServerErrorException(),
      );

      await expect(controller.update(123, updateUserDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      (usersService.remove as jest.Mock).mockResolvedValueOnce(mockUser);
      const result = await controller.remove(mockUser.id);
      expect(usersService.remove).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(new UserEntity(mockUser));
    });

    it('should handle NotFoundException gracefully', async () => {
      (usersService.remove as jest.Mock).mockRejectedValueOnce(new NotFoundException());

      await expect(controller.remove(123)).rejects.toThrow(NotFoundException);
    });

    it('should handle other exceptions gracefully', async () => {
      (usersService.remove as jest.Mock).mockRejectedValueOnce(
        new InternalServerErrorException(),
      );

      await expect(controller.remove(123)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});