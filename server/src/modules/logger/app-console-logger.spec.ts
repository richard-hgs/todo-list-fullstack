import { AppConsoleLogger } from "./app-console-logger";
import {
  dateTimeFormatter,
  formatContext,
  formatMessage,
  formatPid,
  formatTimestampDiff,
  getTimestamp
} from "../../utils/tests/utils";

describe("AppConsoleLogger", () => {
  let logger: AppConsoleLogger;
  const mockTimestamp = 1678886400000; // Example timestamp (2023-03-15T00:00:00.000Z)


  beforeEach(() => {
    logger = new AppConsoleLogger();
    jest.spyOn(logger, 'getTimestamp' as any).mockReturnValue(dateTimeFormatter.format(mockTimestamp)); // Mock timestamp for consistent testing
    jest.useFakeTimers();
    jest.setSystemTime(mockTimestamp);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should be defined', () => {
    expect(logger).toBeDefined();
  });

  it('should call console methods with message only all log levels enabled', () => {
    const message = 'test message';
    const messageFn = () => message;

    // Log functional message
    let stdoutWriteMock = jest.spyOn(process.stdout, 'write').mockImplementation();
    logger.log(messageFn);
    expect(stdoutWriteMock).toHaveBeenCalledWith(
      formatMessage("log", message, formatPid(process.pid), "log".toUpperCase().padStart(7, ' '), "", "", getTimestamp(dateTimeFormatter, mockTimestamp))
    );
    stdoutWriteMock.mockRestore();

    // Log class name
    stdoutWriteMock = jest.spyOn(process.stdout, 'write').mockImplementation();
    logger.log(() => AppConsoleLogger);
    expect(stdoutWriteMock).toHaveBeenCalledWith(
      formatMessage("log", "AppConsoleLogger", formatPid(process.pid), "log".toUpperCase().padStart(7, ' '), "", "", getTimestamp(dateTimeFormatter, mockTimestamp))
    );
    stdoutWriteMock.mockRestore();

    // Log plain object
    stdoutWriteMock = jest.spyOn(process.stdout, 'write').mockImplementation();
    logger.log({bigint_val: BigInt(1234)});
    expect(stdoutWriteMock).toHaveBeenCalled();
    stdoutWriteMock.mockRestore();

    // Default logs
    stdoutWriteMock = jest.spyOn(process.stdout, 'write').mockImplementation();
    logger.log(message);
    expect(stdoutWriteMock).toHaveBeenCalledWith(
      formatMessage("log", message, formatPid(process.pid), "log".toUpperCase().padStart(7, ' '), "", "", getTimestamp(dateTimeFormatter, mockTimestamp))
    );
    stdoutWriteMock.mockRestore();

    let stderrWriteMock = jest.spyOn(process.stderr, 'write').mockImplementation();
    logger.error(message);
    expect(stderrWriteMock).toHaveBeenCalledWith(
      formatMessage("error", message, formatPid(process.pid), "error".toUpperCase().padStart(7, ' '), "", "", getTimestamp(dateTimeFormatter, mockTimestamp))
    );
    stderrWriteMock.mockRestore();

    stdoutWriteMock = jest.spyOn(process.stdout, 'write').mockImplementation();
    logger.warn(message);
    expect(stdoutWriteMock).toHaveBeenCalledWith(
      formatMessage("warn", message, formatPid(process.pid), "warn".toUpperCase().padStart(7, ' '), "", "", getTimestamp(dateTimeFormatter, mockTimestamp))
    );
    stdoutWriteMock.mockRestore();

    stdoutWriteMock = jest.spyOn(process.stdout, 'write').mockImplementation();
    logger.debug(message);
    expect(stdoutWriteMock).toHaveBeenCalledWith(
      formatMessage("debug", message, formatPid(process.pid), "debug".toUpperCase().padStart(7, ' '), "", "", getTimestamp(dateTimeFormatter, mockTimestamp))
    );
    stdoutWriteMock.mockRestore();

    stdoutWriteMock = jest.spyOn(process.stdout, 'write').mockImplementation();
    logger.verbose(message);
    expect(stdoutWriteMock).toHaveBeenCalledWith(
      formatMessage("verbose", message, formatPid(process.pid), "verbose".toUpperCase().padStart(7, ' '), "", "", getTimestamp(dateTimeFormatter, mockTimestamp))
    );
    stdoutWriteMock.mockRestore();

    stdoutWriteMock = jest.spyOn(process.stdout, 'write').mockImplementation();
    logger.fatal(message);
    expect(stdoutWriteMock).toHaveBeenCalledWith(
      formatMessage("fatal", message, formatPid(process.pid), "fatal".toUpperCase().padStart(7, ' '), "", "", getTimestamp(dateTimeFormatter, mockTimestamp))
    );
    stdoutWriteMock.mockRestore();
  });

  it('should call console methods with message only all log levels disabled', () => {
    const message = 'test message';

    // Disable all logs
    logger.setLogLevels([]);

    let stdoutWriteMock = jest.spyOn(process.stdout, 'write').mockImplementation();
    logger.log(message);
    expect(stdoutWriteMock).toBeCalledTimes(0);
    stdoutWriteMock.mockRestore();

    let stderrWriteMock = jest.spyOn(process.stderr, 'write').mockImplementation();
    logger.error(message);
    expect(stderrWriteMock).toBeCalledTimes(0);
    stderrWriteMock.mockRestore();

    stdoutWriteMock = jest.spyOn(process.stdout, 'write').mockImplementation();
    logger.warn(message);
    expect(stdoutWriteMock).toBeCalledTimes(0);
    stdoutWriteMock.mockRestore();

    stdoutWriteMock = jest.spyOn(process.stdout, 'write').mockImplementation();
    logger.debug(message);
    expect(stdoutWriteMock).toBeCalledTimes(0);
    stdoutWriteMock.mockRestore();

    stdoutWriteMock = jest.spyOn(process.stdout, 'write').mockImplementation();
    logger.verbose(message);
    expect(stdoutWriteMock).toBeCalledTimes(0);
    stdoutWriteMock.mockRestore();

    stdoutWriteMock = jest.spyOn(process.stdout, 'write').mockImplementation();
    logger.fatal(message);
    expect(stdoutWriteMock).toBeCalledTimes(0);
    stdoutWriteMock.mockRestore();

    // Enable all logs
    logger.setLogLevels(
      [
        'log',
        'error',
        'warn',
        'debug',
        'verbose',
        'fatal',
      ]
    );

  });

  it("should save original context and set context", () => {
    const appConsoleLogger = new AppConsoleLogger("CONTEXT", {});
    jest.spyOn(appConsoleLogger, "setContext");

    appConsoleLogger.setContext("CONTEXT 2");
    expect(appConsoleLogger.setContext).toHaveBeenCalledWith("CONTEXT 2");

    jest.spyOn(appConsoleLogger, "resetContext");
    appConsoleLogger.resetContext();
    expect(appConsoleLogger.resetContext).toHaveBeenCalled();
  });

  it("should log timestamps", () => {
    const message = "test message";
    const appConsoleLogger = new AppConsoleLogger("CONTEXT", {
      timestamp: true
    });

    // Log functional message
    let stdoutWriteMock = jest.spyOn(process.stdout, 'write').mockImplementation();
    appConsoleLogger.log(message);
    expect(stdoutWriteMock).toHaveBeenCalledWith(
      formatMessage("log", message, formatPid(process.pid), "log".toUpperCase().padStart(7, ' '), formatContext("CONTEXT"), formatTimestampDiff(0), getTimestamp(dateTimeFormatter, mockTimestamp))
    );
    stdoutWriteMock.mockRestore();
  });

  it("should log args", () => {
    const message = "test message";

    // Log functional message
    let stdoutWriteMock = jest.spyOn(process.stdout, 'write').mockImplementation();
    logger.log(message, 1);
    expect(stdoutWriteMock).toHaveBeenCalledWith(
      formatMessage("log", message, formatPid(process.pid), "log".toUpperCase().padStart(7, ' '), "", "", getTimestamp(dateTimeFormatter, mockTimestamp))
    );
    stdoutWriteMock.mockRestore();

    let stack = null;
    try {
      // noinspection ExceptionCaughtLocallyJS
      throw Error("fake");
    } catch (e) {
      stack = (e as Error).stack;
    }

    // Stack with two args
    let stderrWriteMock = jest.spyOn(process.stderr, 'write').mockImplementation();
    logger.error(message, stack);
    expect(stderrWriteMock).toHaveBeenNthCalledWith(1,
      formatMessage("error", message, formatPid(process.pid), "error".toUpperCase().padStart(7, ' '), "", "", getTimestamp(dateTimeFormatter, mockTimestamp))
    );
    expect(stderrWriteMock).toHaveBeenCalledTimes(2)
    stderrWriteMock.mockRestore();


    // Stack with context
    stderrWriteMock = jest.spyOn(process.stderr, 'write').mockImplementation();
    logger.error(message, {key: "value"}, "CONTEXT");
    expect(stderrWriteMock).toHaveBeenCalledTimes(2)
    stderrWriteMock.mockRestore();

    // Stack only multiple stacks
    stderrWriteMock = jest.spyOn(process.stderr, 'write').mockImplementation();
    logger.error(message, {key: "value"}, {key: "value"});
    expect(stderrWriteMock).toHaveBeenCalledTimes(3)
    stderrWriteMock.mockRestore();

    // Stack only two stacks
    stderrWriteMock = jest.spyOn(process.stderr, 'write').mockImplementation();
    logger.error(message, {key: BigInt('1234567890123456789012345678901234567890')});
    expect(stderrWriteMock).toHaveBeenCalledTimes(1)
    stderrWriteMock.mockRestore();
  });
});

/*
describe('AppConsoleLogger', () => {
  let logger: AppConsoleLogger;
  let oldConsole: Console;
  const mockTimestamp = 1678886400000; // Example timestamp (2023-03-15T00:00:00.000Z)

  beforeEach(() => {
    logger = new AppConsoleLogger();
    oldConsole = console;
    console = { ...console, debug: jest.fn(), error: jest.fn(), log: jest.fn(), warn: jest.fn() , verbose: jest.fn()} as any;
    jest.spyOn(logger, 'getTimestamp').mockReturnValue('2024-07-22 10:00:00'); // Mock timestamp for consistent testing
    jest.useFakeTimers();
    jest.setSystemTime(mockTimestamp);
  });

  afterEach(() => {
    global.console = oldConsole;
    jest.useRealTimers();

  });

  it('should be defined', () => {
    expect(logger).toBeDefined();
  });

  it('should call console methods with correct arguments and default context', () => {
    const message = 'test message';
    const optionalParams = ['param1', 'param2'];

    logger.log(message, ...optionalParams);
    expect(console.log).toHaveBeenCalledWith(`[Nest] ${process.pid}  - 2024-07-22 10:00:00 LOG     ${clc.green(message)} ${clc.green(optionalParams.join(' '))}\n`);


    logger.error(message, ...optionalParams);
    expect(console.error).toHaveBeenCalledWith(`[Nest] ${process.pid}  - 2024-07-22 10:00:00 ERROR   ${clc.red(message)} ${clc.red(optionalParams.join(' '))}\n`);


    logger.warn(message, ...optionalParams);
    expect(console.warn).toHaveBeenCalledWith(`[Nest] ${process.pid}  - 2024-07-22 10:00:00 WARN    ${clc.yellow(message)} ${clc.yellow(optionalParams.join(' '))}\n`);


    logger.debug(message, ...optionalParams);
    expect(console.debug).toHaveBeenCalledWith(`[Nest] ${process.pid}  - 2024-07-22 10:00:00 DEBUG   ${clc.magentaBright(message)} ${clc.magentaBright(optionalParams.join(' '))}\n`);

    logger.verbose(message, ...optionalParams);
    expect(console.verbose).toHaveBeenCalledWith(`[Nest] ${process.pid}  - 2024-07-22 10:00:00 VERBOSE ${clc.cyanBright(message)} ${clc.cyanBright(optionalParams.join(' '))}\n`);

    logger.fatal(message, ...optionalParams);
    expect(console.log).toHaveBeenCalledWith(`[Nest] ${process.pid}  - 2024-07-22 10:00:00 FATAL   ${clc.bold(message)} ${clc.bold(optionalParams.join(' '))}\n`);


  });

  it('should call console methods with correct arguments and provided context', () => {
    const message = 'test message';
    const context = 'TestContext';

    logger.log(message, context);
    expect(console.log).toHaveBeenCalledWith(`[Nest] ${process.pid}  - 2024-07-22 10:00:00 LOG     [TestContext] ${clc.green(message)}\n`);
  });

  it('should call console.error for fatal logs', () => {
    const message = 'fatal message';

    logger.fatal(message);
    expect(console.log).toHaveBeenCalledWith(`[Nest] ${process.pid}  - 2024-07-22 10:00:00 FATAL    ${clc.bold(message)}\n`); // Fatal uses stdout
  });

  it('should add and remove interceptors', () => {
    const interceptor1 = { intercept: jest.fn() } as any;
    const interceptor2 = { intercept: jest.fn() } as any;

    logger.addInterceptor(interceptor1);
    logger.addInterceptor(interceptor2);
    expect(logger.interceptors).toEqual([interceptor1, interceptor2]);

    logger.removeInterceptor(interceptor1);
    expect(logger.interceptors).toEqual([interceptor2]);
  });


  it('should call interceptors when a log is written', () => {
    const logMessage = "This is a test log message";

    const mockInterceptor1 = { intercept: jest.fn() };
    const mockInterceptor2 = { intercept: jest.fn() };

    logger.addInterceptor(mockInterceptor1 as any);
    logger.addInterceptor(mockInterceptor2 as any);

    logger.log(logMessage);

    const expectedMessage = `[Nest] ${process.pid}  - 2024-07-22 10:00:00 LOG     ${clc.green(logMessage)}\n`;

    const logItems: LogItem[] = [{
      level: "log",
      message: expectedMessage
    }];
    expect(mockInterceptor1.intercept).toHaveBeenCalledWith(logItems);
    expect(mockInterceptor2.intercept).toHaveBeenCalledWith(logItems);
  });


  it('should handle different log levels and optional params', () => {
    const mockInterceptor = { intercept: jest.fn() };
    logger.addInterceptor(mockInterceptor as any);
    const message = 'test';
    const context = "test context"
    logger.log(message, 'test', 'params', context);
    const expectedLogMessage = `[Nest] ${process.pid}  - 2024-07-22 10:00:00 LOG     [${context}] ${clc.green(message)} ${clc.green('test')} ${clc.green('params')}\n`
    expect(mockInterceptor.intercept).toHaveBeenCalledWith([{
      level: "log",
      message: expectedLogMessage
    }]);
  });


  it('should correctly format objects and arrays', () => {
    const message = { test: 'message', arr: [1, 2, 3] };
    logger.log(message);

    const expectedMessage = `[Nest] ${process.pid}  - 2024-07-22 10:00:00 LOG     ${clc.green('Object:')}\n${JSON.stringify(message, null, 2)}\n\n`;

    expect(console.log).toHaveBeenCalledWith(expectedMessage);
  });

  it('should stringify functions', () => {
    const message = () => 'test';
    logger.log(message);
    const expectedMessage = `[Nest] ${process.pid}  - 2024-07-22 10:00:00 LOG     ${clc.green('test')}\n`;
    expect(console.log).toHaveBeenCalledWith(expectedMessage);
  });

  it('should handle class as message', () => {
    class Test {}
    logger.log(Test);
    const expectedMessage = `[Nest] ${process.pid}  - 2024-07-22 10:00:00 LOG     ${clc.green('Test')}\n`;
    expect(console.log).toHaveBeenCalledWith(expectedMessage);
  });

  it('should print stack trace', () => {
    const message = 'error message';
    const stack = 'Error: ...\n   at ...';

    console.error = jest.fn();
    console.log = jest.fn();
    process.stderr.write = jest.fn();

    logger.error(message, stack);

    expect(console.error).toHaveBeenCalled();
    expect(process.stderr.write).toHaveBeenCalledWith(`${stack}\n`);
  });

  it('should not print stack trace if its not a valid stack', () => {
    const message = 'error message';
    const stack = 'not a stack trace';
    process.stderr.write = jest.fn();
    console.error = jest.fn();
    logger.error(message, stack);
    expect(process.stderr.write).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
  });

  it('should update and get timestamp diff', () => {
    logger.options = { timestamp: true };

    jest.advanceTimersByTime(50);
    const timestampDiff = logger.updateAndGetTimestampDiff();
    expect(timestampDiff).toBe('\x1B[33m +50ms\x1B[39m');
  });


  it('should set log levels', () => {
    const levels = ['log', 'warn', 'error'];
    logger.setLogLevels(levels);
    expect(logger.options.logLevels).toEqual(levels);
  });

  it('should set and reset context', () => {
    const context = 'TestContext';
    logger.setContext(context);
    expect(logger.context).toBe(context);

    logger.resetContext();
    expect(logger.context).toBeUndefined();

    const logger2 = new AppConsoleLogger('OriginalContext');
    logger2.setContext(context);

    logger2.resetContext();
    expect(logger2.context).toBe('OriginalContext');
  });


  it('should check log level is enabled', () => {
    expect(logger.isLevelEnabled('log')).toBeTruthy();
    expect(logger.isLevelEnabled('test' as any)).toBeFalsy();

    logger.setLogLevels(['warn', 'error']);
    expect(logger.isLevelEnabled('log')).toBeFalsy();
    expect(logger.isLevelEnabled('warn')).toBeTruthy();
  });


  it('should get timestamp', () => {
    expect(logger.getTimestamp()).toBe('2024-07-22 10:00:00');
  });
});
 */