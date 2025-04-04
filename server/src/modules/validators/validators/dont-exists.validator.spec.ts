import { DontExistsValidator } from './dont-exists.validator';
import { PrismaBaseService } from '../../prisma/prisma-base.service';
import { ValidationArguments } from 'class-validator';
import { User } from "@prisma/client";
import { DbSchemaType } from "../../database/model/db-schema-type";

describe('DontExistsValidator', () => {
  let validator: DontExistsValidator;
  let prismaService: PrismaBaseService;

  beforeEach(() => {
    prismaService = new PrismaBaseService(); // Replace with your actual PrismaService setup
    validator = new DontExistsValidator(prismaService);
  });

  it('should be defined', () => {
    expect(validator).toBeDefined();
  });

  it('should return the correct default error message DbSchemaType.BASE', () => {
    const validationArgs: ValidationArguments = {
      constraints: [{ tblName: 'user', dbSchemaType: DbSchemaType.BASE }],
      property: 'email',
      value: 'test@example.com',
    } as unknown as ValidationArguments;
    expect(validator.defaultMessage(validationArgs)).toBe('User email already exists');
  });

  it('should return true if value does not exist in database DbSchemaType.BASE', async () => {
    const validationArgs: ValidationArguments = {
      constraints: [{ tblName: 'user', dbSchemaType: DbSchemaType.BASE }],
      property: 'email',
      value: 'test@example.com',
    } as unknown as ValidationArguments;
    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce(null);
    expect(await validator.validate('test@example.com', validationArgs)).toBe(true);
    expect(prismaService.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
    });
  });

  it('should return false if value exists in database DbSchemaType.BASE', async () => {
    const validationArgs: ValidationArguments = {
      constraints: [{ tblName: 'user', dbSchemaType: DbSchemaType.BASE }],
      property: 'email',
      value: 'existing@example.com',
    } as unknown as ValidationArguments;

    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce({
      // Mock a user object
      id: 1,
      email: 'existing@example.com',
      // ... other properties
    } as unknown as User);

    expect(await validator.validate('existing@example.com', validationArgs)).toBe(false);
    expect(prismaService.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'existing@example.com' },
    });
  });

  it('should return false if value is undefined DbSchemaType.BASE', async () => {

    const validationArgs: ValidationArguments = {
      constraints: [{ tblName: 'user', dbSchemaType: DbSchemaType.BASE }],
      property: 'email',
      value: undefined,
    } as unknown as ValidationArguments;

    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce({
      // Mock a user object
      id: 1,
      email: 'existing@example.com',
      // ... other properties
    } as unknown as User);

    expect(await validator.validate(undefined, validationArgs)).toBe(false);
    expect(prismaService.user.findUnique).not.toHaveBeenCalled(); // Prisma shouldn't be called
  });
});