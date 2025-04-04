import { AppLoggerMiddleware } from "./app-logger.midleware";
import { getLoggerPattern, mockExecutionContext, mockResponse } from "../../utils/tests/utils";

describe('AppLoggerMiddleware', () => {
  let appLoggerMiddleware: AppLoggerMiddleware;
  let stdoutSpy: jest.SpyInstance;
  let stderrSpy: jest.SpyInstance;

  beforeEach(() => {
    appLoggerMiddleware = new AppLoggerMiddleware();
    stdoutSpy = jest.spyOn(process.stdout, "write").mockImplementation();
    stderrSpy = jest.spyOn(process.stderr, "write").mockImplementation();
  });

  afterEach(() => {
    stdoutSpy.mockRestore();
    stderrSpy.mockRestore();
  })

  it('should be defined', () => {
    expect(appLoggerMiddleware).toBeDefined();
  });

  it('should log request and response information', () => {
    const loggerSpy = jest.spyOn(appLoggerMiddleware.logger, 'log');

    const reqHeaders: {[mKey:string]: unknown} = {
      "user-agent": "Mockup User Agent",
      "accept-language": "en-US",
      "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
    }

    const executionContext = mockExecutionContext(undefined, undefined, reqHeaders);
    const mockNext = jest.fn();

    appLoggerMiddleware.use(
      executionContext.switchToHttp().getRequest(),
      executionContext.switchToHttp().getResponse(),
      mockNext,
    );

    executionContext.switchToHttp().getResponse().send();

    expect(loggerSpy).toHaveBeenCalledWith(
      expect.stringMatching(
        getLoggerPattern()
      )
    )

    // Restore logger.log
    loggerSpy.mockRestore();
  });

  it('should return 0 bytes for no content-length header', () => {
    const loggerSpy = jest.spyOn(appLoggerMiddleware.logger, 'log');

    const executionContext = mockExecutionContext(
      undefined, undefined, undefined, undefined, undefined, undefined,
      mockResponse(
        undefined, undefined, {"content-length": undefined}, true
      )
    );
    const mockNext = jest.fn();

    appLoggerMiddleware.use(
      executionContext.switchToHttp().getRequest(),
      executionContext.switchToHttp().getResponse(),
      mockNext,
    );

    executionContext.switchToHttp().getResponse().send();

    expect(loggerSpy).toHaveBeenCalledWith(
      expect.stringMatching(
        getLoggerPattern(
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          0
        )
      )
    )

    // Restore logger.log
    loggerSpy.mockRestore();
  });

  it('should return empty for no user-agent header', () => {
    const loggerSpy = jest.spyOn(appLoggerMiddleware.logger, 'log');

    const executionContext = mockExecutionContext(
      undefined, undefined, {
        "user-agent": undefined,
        "accept-language": "en-US"
      }, undefined, undefined, undefined
    );
    const mockNext = jest.fn();

    appLoggerMiddleware.use(
      executionContext.switchToHttp().getRequest(),
      executionContext.switchToHttp().getResponse(),
      mockNext,
    );

    executionContext.switchToHttp().getResponse().send();

    expect(loggerSpy).toHaveBeenCalledWith(
      expect.stringMatching(
        getLoggerPattern(
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          2,
          undefined,
          ""
        )
      )
    )

    // Restore logger.log
    loggerSpy.mockRestore();
  });

  // it('should call next middleware function', () => {
  //   appLoggerMiddleware.use(
  //     mockRequest as Request,
  //     mockResponse as Response,
  //     mockNext,
  //   );
  //   expect(mockNext).toHaveBeenCalled();
  // });
});