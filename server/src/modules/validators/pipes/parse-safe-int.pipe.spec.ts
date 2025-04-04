import { ParseSafeIntPipe } from './parse-safe-int.pipe';
import { ArgumentMetadata, BadRequestException } from '@nestjs/common';

describe('ParseSafeIntPipe', () => {
  let pipe: ParseSafeIntPipe;

  beforeEach(() => {
    pipe = new ParseSafeIntPipe();
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should parse valid integers within safe range', async () => {
    const metadata: ArgumentMetadata = {
      type: 'param',
      metatype: Number,
      data: 'test',
    };
    expect(await pipe.transform('123', metadata)).toBe(123);
    expect(await pipe.transform('0', metadata)).toBe(0);
    expect(await pipe.transform('-123', metadata)).toBe(-123);
    expect(await pipe.transform(Number.MAX_SAFE_INTEGER.toString(), metadata)).toBe(Number.MAX_SAFE_INTEGER);
    expect(await pipe.transform(Number.MIN_SAFE_INTEGER.toString(), metadata)).toBe(Number.MIN_SAFE_INTEGER);
  });

  it('should throw BadRequestException for invalid integers', async () => {
    const metadata: ArgumentMetadata = {
      type: 'param',
      metatype: Number,
      data: 'test',
    };
    await expect(pipe.transform('abc', metadata)).rejects.toThrow(BadRequestException);
    await expect(pipe.transform('123.45', metadata)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException for integers outside safe range', async () => {
    const metadata: ArgumentMetadata = {
      type: 'param',
      metatype: Number,
      data: 'test',
    };
    await expect(pipe.transform((Number.MAX_SAFE_INTEGER + 1).toString(), metadata)).rejects.toThrow(
      BadRequestException,
    );
    await expect(pipe.transform((Number.MIN_SAFE_INTEGER - 1).toString(), metadata)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should use custom exception factory', async () => {
    const metadata: ArgumentMetadata = {
      type: 'param',
      metatype: Number,
      data: 'testParam',
    };
    const customPipe = new ParseSafeIntPipe('number', 'testProp', {
      exceptionFactory: (error) => new BadRequestException(`Custom error: ${error}`),
    });
    await expect(customPipe.transform('abc', metadata)).rejects.toThrow('Validation failed (numeric string is expected). Number testProp (abc)');
  });
});