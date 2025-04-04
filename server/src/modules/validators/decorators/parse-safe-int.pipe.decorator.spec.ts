import { ParseSafeInt } from './parse-safe-int.pipe.decorator';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ParseSafeIntPipe } from "../pipes/parse-safe-int.pipe";

class TestDto {
  @ParseSafeInt()
  queryValue: number;

  @ParseSafeInt('param')
  paramValue: number;
}

describe('ParseSafeInt Decorator and Pipe', () => {
  describe('Decorator', () => {
    it('should transform valid query parameter to a number', async () => {
      const dto = plainToInstance(TestDto, { queryValue: '123' });
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
      expect(dto.queryValue).toBe(123);
    });

    it('should transform valid param parameter to a number', async () => {
      const dto = plainToInstance(TestDto, { paramValue: '456' });
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
      expect(dto.paramValue).toBe(456);
    });
  });

  describe('Pipe', () => {
    let pipe: ParseSafeIntPipe;

    beforeEach(() => {
      pipe = new ParseSafeIntPipe();
    });

    it('should transform a valid numeric string to a number', () => {
      const metadata: ArgumentMetadata = { type: 'query', data: 'test' };
      expect(pipe.transformSync('123', metadata)).toBe(123);
    });

    it('should throw an error for an invalid numeric string', () => {
      const metadata: ArgumentMetadata = { type: 'query', data: 'test' };
      expect(() => pipe.transformSync('abc', metadata)).toThrowError(BadRequestException);
    });

    it('should throw a BadRequestException with property details for invalid input', () => {
      const pipeWithDetails = new ParseSafeIntPipe('param', 'userId');
      const metadata: ArgumentMetadata = { type: 'param', data: 'userId' };

      expect(() => pipeWithDetails.transformSync('invalid', metadata))
        .toThrowError(
          new BadRequestException('Validation failed (numeric string is expected). Param userId (invalid)')
        );
    });

    it('should handle null or undefined values if optional is true', () => {
      const optionalPipe = new ParseSafeIntPipe('query', 'page', { optional: true });
      const metadata: ArgumentMetadata = { type: 'query', data: 'page' };

      expect(optionalPipe.transformSync(null, metadata)).toBeNull();
      expect(optionalPipe.transformSync(undefined, metadata)).toBeUndefined();
    });

    it('should handle null or undefined values if optional is false', () => {
      const optionalPipe = new ParseSafeIntPipe('query', 'page', { optional: false });
      const metadata: ArgumentMetadata = { type: 'query', data: 'page' };

      expect(() => optionalPipe.transformSync(null, metadata)).toThrowError(new BadRequestException("Validation failed (numeric string is expected). Query page (null)"));
      expect(() => optionalPipe.transformSync(undefined, metadata)).toThrowError(new BadRequestException("Validation failed (numeric string is expected). Query page (undefined)"));
    });

    it('should handle null or undefined values if optional undefined', () => {
      const optionalPipe = new ParseSafeIntPipe('query', 'page');
      const metadata: ArgumentMetadata = { type: 'query', data: 'page' };

      expect(() => optionalPipe.transformSync(null, metadata)).toThrowError(new BadRequestException("Validation failed (numeric string is expected). Query page (null)"));
      expect(() => optionalPipe.transformSync(undefined, metadata)).toThrowError(new BadRequestException("Validation failed (numeric string is expected). Query page (undefined)"));
    });
  });
});