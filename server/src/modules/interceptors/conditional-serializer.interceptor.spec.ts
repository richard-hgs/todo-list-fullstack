import { of } from 'rxjs';
import { ConditionalSerializerInterceptor } from './conditional-serializer.interceptor'; // Replace with your actual file path
import { mockExecutionContext } from "../../utils/tests/utils";
import { ClassSerializerInterceptor } from "@nestjs/common";

describe('ConditionalSerializerInterceptor', () => {
  let interceptor: ConditionalSerializerInterceptor;

  beforeEach(() => {
    interceptor = new ConditionalSerializerInterceptor({} as any); // Pass a dummy Reflector
  });

  it('should skip serialization for /otp/resend route', () => {
    const expected = of({ test: 'value' });
    const executionContext = mockExecutionContext("/otp/resend/email");
    const mockNext = { handle: () => expected };

    const result = interceptor.intercept(executionContext, mockNext);

    // Use toMatchObject to avoid strict equality checks on Observables.
    expect(result).toMatchObject(expected);
  });


  it('should apply serialization for other routes', () => {
    const expected = of({serialized: 'data'});
    const executionContext = mockExecutionContext("/users");
    const mockNext = { handle: () => expected };

    const spy = jest.spyOn(ClassSerializerInterceptor.prototype, 'intercept');
    spy.mockReturnValueOnce(expected);

    const result = interceptor.intercept(executionContext, mockNext);
    expect(result).toMatchObject(expected);
    expect(spy).toHaveBeenCalledWith(executionContext, mockNext);
    spy.mockRestore();
  });
});