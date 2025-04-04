import { IsGreaterThanZero } from './is-greater-than-zero.decorator';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

class TestDto {
  @IsGreaterThanZero()
  value: number;
}

describe('IsGreaterThanZero Decorator', () => {
  it('should pass validation for numbers greater than zero', async () => {
    const dto = plainToInstance(TestDto, { value: 1 });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation for zero', async () => {
    const dto = plainToInstance(TestDto, { value: 0 });
    const errors = await validate(dto);

    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toHaveProperty('IsGreaterThanZero');
  });

  it('should fail validation for negative numbers', async () => {
    const dto = plainToInstance(TestDto, { value: -1 });
    const errors = await validate(dto);

    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toHaveProperty('IsGreaterThanZero');
  });

  it('should fail validation for non-number values', async () => {
    const dto = plainToInstance(TestDto, { value: 'not a number' });
    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0); // Might have other validation errors
  });

  it('should use the custom validation message', async () => {
    class TestDtoWithMessage {
      @IsGreaterThanZero({ message: 'Custom error message' })
      value: number;
    }

    const dto = plainToInstance(TestDtoWithMessage, { value: 0 });
    const errors = await validate(dto);

    expect(errors.length).toBe(1);
    expect(errors[0].constraints?.IsGreaterThanZero).toBe('Custom error message');
  });
});