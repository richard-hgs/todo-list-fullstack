import { IsNonZero } from './is-non-zero.decorator';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

class TestDto {
  @IsNonZero()
  value: number;
}

describe('IsNonZero Decorator', () => {
  it('should pass validation for non-zero numbers', async () => {
    const dto = plainToInstance(TestDto, { value: 1 });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation for zero', async () => {
    const dto = plainToInstance(TestDto, { value: 0 });
    const errors = await validate(dto);

    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toHaveProperty('IsNonZero'); // Check for the correct constraint name
  });

  it('should fail validation for non-number values', async () => {
    const dto = plainToInstance(TestDto, { value: 'not a number' });
    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0); // It might have other validation errors
  });

  it('should use the custom validation message', async () => {
    class TestDtoWithMessage {
      @IsNonZero({ message: 'Custom error message' })
      value: number;
    }

    const dto = plainToInstance(TestDtoWithMessage, { value: 0 });
    const errors = await validate(dto);

    expect(errors.length).toBe(1);
    expect(errors[0].constraints?.IsNonZero).toBe('Custom error message');
  });
});