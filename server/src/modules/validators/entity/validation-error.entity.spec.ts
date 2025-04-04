import { ValidationErrorEntity } from './validation-error.entity';

describe('ValidationErrorEntity', () => {
  it('should create an instance with the provided data', () => {
    const data = {
      message: ['Name already exists', 'Email already exists'],
      error: 'Bad Request',
      statusCode: 400,
    };
    const validationErrorEntity = new ValidationErrorEntity(data);

    expect(validationErrorEntity.message).toEqual(data.message);
    expect(validationErrorEntity.error).toEqual(data.error);
    expect(validationErrorEntity.statusCode).toEqual(data.statusCode);
  });
});