import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from 'express';

/**
 * AppLoggerMiddleware logs basic request and response information to the console.
 *
 * It records the following:
 * - Request method (GET, POST, etc.)
 * - Requested URL
 * - Response status code
 * - Response time (in milliseconds)
 * - Client IP address
 * - Response content length
 * - User agent
 */
@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {

  /**
   * Logger instance
   * @private
   */
  readonly logger = new Logger('HTTP');

  /**
   * Middleware function to log HTTP request/response details.
   *
   * @param request - The Express Request object.
   * @param response - The Express Response object.
   * @param next - The next middleware function in the chain.
   */
  use(request: Request, response: Response, next: NextFunction): void {
    // Record the start time of the request
    const startAt = process.hrtime();
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';
    const acceptLanguage = request.header("accept-language");
    const authorization = request.header("authorization");
    let userId: number|undefined = undefined;
    if (authorization && authorization.includes("Bearer") && authorization.includes(".")) {
      const authParts = authorization.replace("Bearer", "").trim().split(".");
      // const jwtAlgInfo = atob(authParts[0]);
      const jwtPayload = JSON.parse(atob(authParts[1]));
      userId = jwtPayload.userId
    }

    // Attach a listener to the 'close' event of the response
    response.on('close', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length') ?? 0;

      // Calculate the response time in milliseconds
      const diff = process.hrtime(startAt);
      const responseTime = diff[0] * 1e3 + diff[1] * 1e-6;

      // Log the request/response details
      this.logger.log(
        `[${method}] [${originalUrl}] [status ${statusCode}] [${responseTime.toFixed(3)}ms] [ip ${ip}] [user ${userId}] [${contentLength} bytes] [accept-language ${acceptLanguage}] - ${userAgent}`
      );
    });

    // Call the next middleware function in the chain
    next();
  }
}