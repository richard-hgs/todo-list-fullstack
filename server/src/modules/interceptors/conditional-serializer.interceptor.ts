import { CallHandler, ClassSerializerInterceptor, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

export class ConditionalSerializerInterceptor extends ClassSerializerInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Get the current request
    const request = context.switchToHttp().getRequest();

    // Check if it's a mail route (adjust the condition as needed)
    if (request.path.startsWith('/otp/resend')) {
      return next.handle(); // Skip serialization
    }

    return super.intercept(context, next); // Apply serialization
  }
}