import { Match } from './match.decorator';
import { validate } from 'class-validator';

class TestClass {
  @Match('passwordConfirmation')
  password: string;

  passwordConfirmation: string;

  constructor(password: string, passwordConfirmation: string) {
    this.password = password;
    this.passwordConfirmation = passwordConfirmation;
  }
}

describe('Match Decorator', () => {
  it('should validate matching passwords', async () => {
    const testObject = new TestClass('password123', 'password123');
    const errors = await validate(testObject);
    expect(errors.length).toBe(0);
  });

  it('should invalidate non-matching passwords', async () => {
    const testObject = new TestClass('password123', 'wrongPassword');
    const errors = await validate(testObject);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints?.Match).toBe('password must match passwordConfirmation (password)');
    expect(errors[0].property).toBe('password');
  });

  it('should handle undefined values', async () => {
    const testObject = new TestClass(undefined, undefined);  // Test undefined values
    const errors = await validate(testObject);
    expect(errors.length).toBe(0); // Should not error if both are undefined
  });

  it('should handle one undefined value', async () => {
    const testObject = new TestClass('password123', undefined); // Test one undefined
    const errors = await validate(testObject);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints?.Match).toBe('password must match passwordConfirmation (password)');
  });


  it('should use custom validation message', async () => {
    class TestClassWithMessage {
      @Match('passwordConfirmation', { message: 'Passwords do not match!' })
      password: string;

      passwordConfirmation: string;

      constructor(password: string, passwordConfirmation: string) {
        this.password = password;
        this.passwordConfirmation = passwordConfirmation;
      }
    }


    const testObject = new TestClassWithMessage('password123', 'wrongPassword');
    const errors = await validate(testObject);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints?.Match).toBe('Passwords do not match!');
  });

  it('should work with different property names', async () => {
    class DifferentPropertyNames {
      @Match('confirmPassword')
      userPassword: string;

      confirmPassword: string;

      constructor(userPassword: string, confirmPassword: string) {
        this.userPassword = userPassword;
        this.confirmPassword = confirmPassword;
      }
    }

    const testObjectMatching = new DifferentPropertyNames('securePwd', 'securePwd');
    const errorsMatching = await validate(testObjectMatching);
    expect(errorsMatching.length).toBe(0);

    const testObjectNonMatching = new DifferentPropertyNames('securePwd', 'notSecure');
    const errorsNonMatching = await validate(testObjectNonMatching);
    expect(errorsNonMatching.length).toBe(1);
    expect(errorsNonMatching[0].constraints?.Match).toBe('userPassword must match confirmPassword (userPassword)');
  });

});