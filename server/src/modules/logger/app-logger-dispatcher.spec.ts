import { AppLoggerDispatcher } from './app-logger-dispatcher';
import { AppLoggerService } from "./app-logger.service";
import { LogLevel } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaBaseService } from "../prisma/prisma-base.service";

describe('AppLoggerDispatcher', () => {
  let dispatcher: AppLoggerDispatcher;
  let service: AppLoggerService;
  let stdoutSpy: jest.SpyInstance;
  let stderrSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppLoggerService,
        {
          provide: PrismaBaseService,
          useValue: {
            log: {
              createMany: jest.fn().mockResolvedValue([]),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AppLoggerService>(AppLoggerService);
    dispatcher = new AppLoggerDispatcher(() => service, true);

    stdoutSpy = jest.spyOn(process.stdout, "write").mockImplementation();
    stderrSpy = jest.spyOn(process.stderr, "write").mockImplementation();
  });

  afterEach(() => {
    stdoutSpy.mockRestore();
    stderrSpy.mockRestore();
  })

  it('should be defined', () => {
    expect(dispatcher).toBeDefined();
  });

  it('should dispatch logs when service is available', () => {
    const message = 'test message';
    const optionalParams = ['param1', 'param2'];

    jest.spyOn(service, 'debug');
    jest.spyOn(service, 'error');
    jest.spyOn(service, 'fatal');
    jest.spyOn(service, 'log');
    jest.spyOn(service, 'verbose');
    jest.spyOn(service, 'warn');

    callAllLogs(dispatcher, message, optionalParams);

    expect(service.debug).toHaveBeenCalledWith(message, ...optionalParams);
    expect(service.error).toHaveBeenCalledWith(message, ...optionalParams);
    expect(service.fatal).toHaveBeenCalledWith(message, ...optionalParams);
    expect(service.log).toHaveBeenCalledWith(message, ...optionalParams);
    expect(service.verbose).toHaveBeenCalledWith(message, ...optionalParams);
    expect(service.warn).toHaveBeenCalledWith(message, ...optionalParams);
  });

  it('should not buffer logs when service is not available', () => {
    const message = 'test message';
    const optionalParams = ['param1', 'param2'];
    const dispatcher2 = new AppLoggerDispatcher(() => null, false);

    callAllLogs(dispatcher2, message, optionalParams);

    expect(dispatcher2.buffer.length).toBe(0);
  });

  it('should buffer logs when service is not available', () => {
    const message = 'test message';
    const optionalParams = ['param1', 'param2'];
    const dispatcher2 = new AppLoggerDispatcher(() => null, true);

    callAllLogs(dispatcher2, message, optionalParams);

    expect(dispatcher2.buffer.length).toBe(6);
  });

  it('should dispatch buffered logs when service becomes available', () => {
    const message = 'test message';
    const optionalParams = ['param1', 'param2'];

    let mLogService: AppLoggerService|null = null;

    const dispatcher2 = new AppLoggerDispatcher(() => mLogService, true);
    jest.spyOn(service, 'log');

    callAllLogs(dispatcher2, message, optionalParams);

    mLogService = service;
    dispatcher2.dispatchBufferLogs();


    expect(service.log).toHaveBeenCalledWith(message, ...optionalParams);
    expect(dispatcher2.buffer.length).toBe(0);
  });

  it('should call setLogLevels on the service', () => {
    const levels: LogLevel[] = ['debug', 'error'];
    jest.spyOn(service, 'setLogLevels');

    dispatcher.setLogLevels(levels);

    expect(service.setLogLevels).toHaveBeenCalledWith(levels);
  });

  it('should not call any methods if service is null, and should clear buffer on dispatch', () => {
    const message = 'test message';
    const optionalParams = ['param1', 'param2'];
    const dispatcher2 = new AppLoggerDispatcher(() => null, false);
    jest.spyOn(service, 'log');

    dispatcher2.log(message, ...optionalParams);
    dispatcher2.dispatchBufferLogs();

    expect(dispatcher2.buffer.length).toBe(0);
    expect(service.log).not.toHaveBeenCalled();
  });
});

function callAllLogs(dispatcher: AppLoggerDispatcher, message: string, optionalParams: string[]) {
  dispatcher.debug(message, ...optionalParams);
  dispatcher.error(message, ...optionalParams);
  dispatcher.fatal(message, ...optionalParams);
  dispatcher.log(message, ...optionalParams);
  dispatcher.verbose(message, ...optionalParams);
  dispatcher.warn(message, ...optionalParams);
}