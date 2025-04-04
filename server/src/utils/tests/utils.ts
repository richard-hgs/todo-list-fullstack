import { Request, Response } from "express";
import { Otp, OtpUseCase, User, UserRole, UserStatus} from "@prisma/client";
import { I18nService } from "nestjs-i18n";
import { ResourcesService } from "../../modules/resources/resources.service";
import { Test, TestingModule } from "@nestjs/testing";
import { AcceptedLanguages } from "../../types/i18n";
import path from "path";
import { ExecutionContext, HttpStatus } from "@nestjs/common";
import { HttpArgumentsHost } from "@nestjs/common/interfaces";
import { ConfigService } from "../../modules/config/config.service";
import { LogLevel } from "@nestjs/common/services/logger.service";
import { isFunction, isPlainObject } from "@nestjs/common/utils/shared.utils";
import { clc, yellow } from "@nestjs/common/utils/cli-colors.util";
import { UsersService } from "../../modules/users/users.service";

export function mockBaseUsersService(): UsersService {
  return {
    findOneById: jest.fn(),
    findOneByEmail: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn()
  } as unknown as UsersService
}

/**
 * Mocks the ResourcesService for testing purposes.
 *
 * This function creates a testing module with the ResourcesService provider
 * and compiles it. It then retrieves the ResourcesService instance from
 * the compiled module.
 *
 * @returns A Promise that resolves to the mocked ResourcesService instance.
 */
export async function mockResourcesService(): Promise<ResourcesService> {
  const app: TestingModule = await Test.createTestingModule({
    providers: [ResourcesService, ConfigService],
  }).compile();

  const resourcesService = app.get<ResourcesService>(ResourcesService);

  return {
    ...resourcesService,
    getRootDir: jest.fn().mockReturnValue(resourcesService.getRootDir()),
    getSourceDir: jest.fn().mockReturnValue(resourcesService.getSourceDir()),
    getAssetsDir: jest.fn().mockReturnValue(resourcesService.getAssetsDir()),
    getI18nDir: jest.fn().mockReturnValue(resourcesService.getI18nDir()),
    getI18nDirName: jest.fn().mockReturnValue(resourcesService.getI18nDirName()),
    getGeneratedDir: jest.fn().mockReturnValue(resourcesService.getGeneratedDir()),
    getAssetFile: jest.fn().mockImplementation((filePath) => resourcesService.getAssetFile(filePath)),
    getAssetFileJson: jest.fn().mockImplementation((filePath) => resourcesService.getAssetFileJson(filePath)),
    getFileUploadDir: jest.fn().mockReturnValue(resourcesService.getFileUploadDir()),
    getPublicFileUploadPath: jest.fn().mockImplementation((filePath) => resourcesService.getPublicFileUploadPath(filePath)),
    fromPublicFileUploadPath: jest.fn().mockImplementation((filePath) => resourcesService.fromPublicFileUploadPath(filePath)),
  } as unknown as ResourcesService
}

/**
 * Mocks the I18nService for testing purposes.
 *
 * This function creates a mock implementation of the I18nService, primarily
 * mocking the `t` (translate) function. The mock implementation retrieves
 * translations from JSON files based on the provided language and input key.
 *
 * @param resourcesService - Either an instance of ResourcesService or a
 *                          function that returns an instance. This is used
 *                          to access translation files.
 * @param language - The language to use for translations (default: 'en-US').
 *
 * @returns A mocked I18nService object with a mocked `t` function.
 */
export function mockI18nService(
  // resourcesService: ResourcesService|(() => ResourcesService),
  resourcesService: (() => ResourcesService),
  language: AcceptedLanguages = "en-US"
): I18nService {
  return {
    t: jest.fn().mockImplementation((input) => {
      const inputSplit = input.split(".");
      // const mResourcesService: ResourcesService = typeof resourcesService === "function" ? resourcesService() : resourcesService;
      const mResourcesService: ResourcesService = resourcesService();
      const i18nDirName = mResourcesService.getI18nDirName();
      let i18nTranslations = mResourcesService.getAssetFileJson(
        path.normalize(`${i18nDirName}/${language}/${inputSplit[0]}.json`)
      );
      const subInputSplit: string[] = inputSplit.slice(1);

      let tValue = "";
      subInputSplit.forEach((key, index) => {
        if (index < subInputSplit.length - 1) {
          i18nTranslations = i18nTranslations[key] as {[key:string]: unknown};
        } else {
          tValue = i18nTranslations[key] as string;
        }
      });

      return tValue;
    })
  } as unknown as I18nService
}

/**
 * Creates a mocked instance of the `ConfigService`.
 *
 * This function sets up a testing module with the `ConfigService` provider
 * and returns the mocked instance.
 *
 * @returns A Promise that resolves to the mocked `ConfigService` instance.
 */
export async function mockConfigService(): Promise<ConfigService> {
  const app: TestingModule = await Test.createTestingModule({
    providers: [ConfigService],
  }).compile();

  return app.get<ConfigService>(ConfigService);
}

/**
 * Mocks common Prisma query methods.
 *
 * This function returns an object with the following mocked methods:
 *
 * - `create`: Mocked `create` method. Used to create a new record in the database. See [Prisma Documentation](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#create) for more details.
 * - `findMany`: Mocked `findMany` method. Used to retrieve multiple records that match the specified filter criteria. See [Prisma Documentation](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findmany) for more details.
 * - `findAll`: Mocked `findAll` method. An alias for `findMany`.
 * - `findUnique`: Mocked `findUnique` method. Used to retrieve a single unique record that matches the specified criteria. See [Prisma Documentation](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findunique) for more details.
 * - `findOne`: Mocked `findOne` method. An alias for `findUnique`.
 * - `update`: Mocked `update` method. Used to update an existing record in the database. See [Prisma Documentation](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#update) for more details.
 * - `delete`: Mocked `delete` method. Used to delete a record from the database. See [Prisma Documentation](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#delete) for more details.
 * - `remove`: Mocked `remove` method. An alias for `delete`.
 *
 * @returns An object containing mocked Prisma query methods.
 */
export function mockPrismaQueries() {
  return {
    create: jest.fn(),
    findMany: jest.fn(),
    findAll: jest.fn(),
    findUnique: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    remove: jest.fn(),
    deleteMany: jest.fn()
  }
}

/**
 * Creates a mock ExecutionContext object for testing NestJS middleware or other components that rely on it.
 *
 * This function provides a convenient way to set up a realistic testing environment by mocking:
 *
 * - Request object (`req`):  Includes mocked methods for common request properties like headers, method, URL, and IP.
 * - Response object (`resp`):  Uses `mockResponse` to provide a pre-configured mock response.
 * - HttpArgumentsHost: Mocked to return the configured `req` and `resp` objects.
 * - ExecutionContext:  Mocked to return the configured `HttpArgumentsHost`.
 *
 * @param reqUrl The requested URL. Defaults to '/test'.
 * @param reqMethod The HTTP method. Defaults to 'POST'.
 * @param reqHeaders An object containing request headers.
 *               Defaults to { "user-agent": "Mockup User Agent", "accept-language": "en-US" }.
 * @param reqUser  The authenticated user object (optional). Defaults to undefined.
 * @param reqIp  The client's IP address. Defaults to "0.0.0.0".
 * @param req  (Optional) A custom Request object. If provided, this will override the defaults.
 * @param resp (Optional) A custom Response object. If not provided, `mockResponse()` is used.
 * @param httpArgumentsHost (Optional) A custom HttpArgumentsHost object.
 * @param executionContext (Optional) A custom ExecutionContext object.
 *
 * @returns A mocked ExecutionContext object ready for use in tests.
 */
export function mockExecutionContext(
  reqUrl: string = "/test",
  reqMethod: string = "POST",
  reqHeaders: {[mKey:string]: unknown} = {
    "user-agent": "Mockup User Agent",
    "accept-language": "en-US"
  },
  reqUser: Express.User|undefined = undefined,
  reqIp: string = "0.0.0.0",
  req: Request = {
    user: reqUser,
    get: jest.fn().mockImplementation((key: string) => reqHeaders[key]),
    header: jest.fn().mockImplementation((key: string) => reqHeaders[key]),
    headers: reqHeaders,
    method: reqMethod,
    originalUrl: reqUrl,
    path: reqUrl,
    ip: reqIp
  } as unknown as Request,
  resp: Response = mockResponse(),
  httpArgumentsHost: HttpArgumentsHost = {
    getRequest: jest.fn().mockReturnValue(req),
    getResponse: jest.fn().mockReturnValue(resp)
  } as unknown as HttpArgumentsHost,
  executionContext: ExecutionContext = {
    switchToHttp: jest.fn().mockReturnValue(httpArgumentsHost)
  } as unknown as ExecutionContext
): ExecutionContext {
  return executionContext;
}

/**
 * Creates a mock Response object for testing purposes.
 *
 * The mock response object includes implementations for common methods like:
 * - `status`: Sets the status code (always returns itself for chaining).
 * - `json`: Sets the response body as JSON (always returns itself for chaining).
 * - `on`: Simulates event listeners, particularly for the 'close' event.
 * - `send`: Simulates sending the response and triggers the 'close' event if a listener is attached.
 * - `get`: Retrieves headers, calculating 'Content-Length' based on provided data.
 *
 * @param statusCode The HTTP status code to set for the response. Defaults to HttpStatus.OK (200).
 * @param data The data object to be used as the response body. Defaults to an empty object.
 * @param headers An object containing headers to set on the response.
 *               Defaults to { "Content-Length": "(GENERATED)" }, where Content-Length is dynamically calculated.
 *
 * @param enforceUseOfHeaders If set to true, the function will not automatically calculate and set the 'content-length' header,
 *                            requiring the user to provide it in the 'headers' object. Defaults to false.
 * @returns A mocked Response object suitable for use in tests.
 */
export function mockResponse(
  statusCode: HttpStatus = HttpStatus.OK,
  data: {[mKey:string]: unknown} = {},
  headers: {[mKey:string]: unknown} = {
    "content-length": "(GENERATED)"
  },
  enforceUseOfHeaders: boolean = false
): Response<unknown, Record<string, unknown>> {
  const contentLength = JSON.stringify(data).length;
  const mHeaders = {...headers};
  if (!enforceUseOfHeaders) {
    mHeaders["content-length"] = contentLength;
  }

  const onParams: {[key: string]: unknown} = {
    close: null
  }

  const resp = {} as unknown as Response;
  resp.statusCode = statusCode;
  resp.status = jest.fn(() => resp);
  resp.json = jest.fn(() => resp);
  resp.on = jest.fn().mockImplementation((key, value) => onParams[key] = value);
  resp.send = jest.fn().mockImplementation(() => {
    if (typeof onParams["close"] === "function") {
      onParams["close"]();
    }
  });
  resp.get = jest.fn().mockImplementation((key) => mHeaders[key]);
  resp.sendFile = jest.fn();
  return resp;
}

/**
 * Generates an array of mock User objects for testing.
 *
 * @returns {User[]} An array containing a single mock User object.
 */
export function mockUsers(): (User & {passwordDecrypted: string})[] {
  // noinspection SpellCheckingInspection
  return [
    {id: 1, email: "testes@testes.com", passwordDecrypted: "12345678", password: "$2b$10$C0wgncbgYPO9PcwgTppEpOBwqTxNBNedo7uu6x4LRw4SQ.gcqvElC", status: UserStatus.Active, name: "Testes", role: UserRole.Common, createdAt: new Date(), updatedAt: new Date(), isEmailActivated: true}
  ]
}

export function mockOtp(): Otp[] {
  return [
    {id: 1, userId: 1, code: "123456", useCase: OtpUseCase.AccountActivation, createdAt: new Date(), updatedAt: new Date(), expiresAt: new Date()}
  ]
}

/**
 * Generates a mock access token (JWT header) for testing.
 *
 * Note: This token is not a valid JWT. It only contains the header part.
 *
 * @returns {string} A mock JWT header string.
 */
export function mockAccessToken(): string {
  return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
}

/**
 * Generates a regular expression that matches a log message with the given details.
 *
 * @param method - The HTTP method (e.g., 'GET', 'POST'). Defaults to 'POST'.
 * @param url - The requested URL. Defaults to '/test'.
 * @param statusCode - The HTTP status code. Defaults to 200.
 * @param ip - The client IP address. Defaults to '0.0.0.0'.
 * @param userId - The ID of the user making the request.  Defaults to `undefined`. No user is logged if `undefined`.
 * @param bytes - The response content length in bytes. Defaults to 0.
 * @param language - The Accept-Language header value. Defaults to 'en-US'.
 * @param userAgent - The User-Agent header value. Defaults to 'Mockup User Agent'.
 * @returns A regular expression matching the log message.
 */
export function getLoggerPattern(
  method: string = "POST",
  url: string = "/test",
  statusCode: number = 200,
  ip: string = "0.0.0.0",
  userId: number|undefined = undefined,
  bytes: number = 2,
  language: string = "en-US",
  userAgent: string = "Mockup User Agent"
) {
  // noinspection RegExpRedundantEscape
  return new RegExp(`\\[${method}\\]\\s\\[${url}\\]\\s\\[status\\s${statusCode}\\]\\s\\[[0-9]+\\.[0-9]+ms\\]\\s\\[ip\\s${ip}\\]\\s\\[user\\s${userId}\\]\\s\\[${bytes}\\sbytes\\]\\s\\[accept-language\\s${language}\\]\\s-\\s${userAgent}`);
}

export const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  day: '2-digit',
  month: '2-digit',
});

export function formatMessage(
  logLevel: LogLevel,
  message: unknown,
  pidMessage: string,
  formattedLogLevel: string,
  contextMessage: string,
  timestampDiff: string,
  timestamp: string
) {
  const output = stringifyMessage(message, logLevel);
  pidMessage = colorize(pidMessage, logLevel);
  formattedLogLevel = colorize(formattedLogLevel, logLevel);
  return `${pidMessage}${timestamp} ${formattedLogLevel} ${contextMessage}${output}${timestampDiff}\n`;
}

export function stringifyMessage(message: unknown, logLevel: LogLevel): any {
  if (isFunction(message)) {
    const messageAsStr = Function.prototype.toString.call(message);
    const isClass = messageAsStr.startsWith('class ');
    if (isClass) {
      // If the message is a class, we will display the class name.
      return stringifyMessage(message.name, logLevel);
    }
    // If the message is a non-class function, call it and re-resolve its value.
    return stringifyMessage(message(), logLevel);
  }

  return isPlainObject(message) || Array.isArray(message)
    ? `${colorize('Object:', logLevel)}\n${JSON.stringify(
      message,
      (key, value) =>
        typeof value === 'bigint' ? value.toString() : value,
      2,
    )}\n`
    : colorize(message as string, logLevel);
}

export function colorize(message: string, logLevel: LogLevel) {
  const color = getColorByLogLevel(logLevel);
  return color(message);
}

export function getColorByLogLevel(level: LogLevel) {
  switch (level) {
    case 'debug':
      return clc.magentaBright;
    case 'warn':
      return clc.yellow;
    case 'error':
      return clc.red;
    case 'verbose':
      return clc.cyanBright;
    case 'fatal':
      return clc.bold;
    default:
      return clc.green;
  }
}

export function getTimestamp(dateTimeFormatter: Intl.DateTimeFormat, timestamp: number): string {
  return dateTimeFormatter.format(timestamp);
}

export function formatPid(pid: number) {
  return `[Nest] ${pid}  - `;
}

export function formatContext(context: string): string {
  return context ? yellow(`[${context}] `) : '';
}

export function formatTimestampDiff(timestampDiff: number) {
  return yellow(` +${timestampDiff}ms`);
}

// function sleep(timeout: number): Promise<void> {
//   return new Promise((resolve) => setTimeout(() => resolve(), timeout));
// }