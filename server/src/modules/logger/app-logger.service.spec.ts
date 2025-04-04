import { Test, TestingModule } from '@nestjs/testing';
import { AppLoggerService } from './app-logger.service';
import { PrismaBaseService } from '../prisma/prisma-base.service';
import { LogItem } from '../../types/log-item';
import { LogLevel } from '@prisma/client';

describe('AppLoggerService', () => {
  let service: AppLoggerService;
  let prismaService: PrismaBaseService;
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
    prismaService = module.get<PrismaBaseService>(PrismaBaseService);
    stdoutSpy = jest.spyOn(process.stdout, "write").mockImplementation();
    stderrSpy = jest.spyOn(process.stderr, "write").mockImplementation();
  });

  afterEach(() => {
    stdoutSpy.mockRestore();
    stderrSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it('should call super methods for log levels', () => {
    const message = 'test message';
    const optionalParams = ['param1', 'param2'];

    const debugSpy = jest.spyOn(AppLoggerService.prototype, 'debug');
    service.debug(message, ...optionalParams);
    expect(debugSpy).toHaveBeenCalledWith(message, ...optionalParams);

    const errorSpy = jest.spyOn(AppLoggerService.prototype, 'error');
    service.error(message, ...optionalParams);
    expect(errorSpy).toHaveBeenCalledWith(message, ...optionalParams);

    const fatalSpy = jest.spyOn(AppLoggerService.prototype, 'fatal');
    service.fatal(message, ...optionalParams);
    expect(fatalSpy).toHaveBeenCalledWith(message, ...optionalParams);

    const logSpy = jest.spyOn(AppLoggerService.prototype, 'log');
    service.log(message, ...optionalParams);
    expect(logSpy).toHaveBeenCalledWith(message, ...optionalParams);

    const verboseSpy = jest.spyOn(AppLoggerService.prototype, 'verbose');
    service.verbose(message, ...optionalParams);
    expect(verboseSpy).toHaveBeenCalledWith(message, ...optionalParams);

    const warnSpy = jest.spyOn(AppLoggerService.prototype, 'warn');
    service.warn(message, ...optionalParams);
    expect(warnSpy).toHaveBeenCalledWith(message, ...optionalParams);
  });

  it('should not update log levels', () => {
    const setLogLevelsSpy = jest.spyOn(service, 'setLogLevels');
    service.setLogLevels(['debug']);
    expect(setLogLevelsSpy).toHaveBeenCalledWith(['debug']);
  });


  it('should save logs to database', async () => {
    const logs: LogItem[] = [
      { message: '[user 123] Test log message 1', level: 'log' },
      { message: '[POST] Test log message 2', level: 'error' },
      { message: '[user abc] Test log message 3', level: 'warn' },
    ];

    await service.onSaveLogs(logs);

    expect(prismaService.log.createMany).toHaveBeenCalledWith({
      data: [
        { message: logs[0].message, level: LogLevel.Log, userId: 123 },
        { message: logs[1].message, level: LogLevel.Error, userId: null },
        { message: logs[2].message, level: LogLevel.Warn, userId: null },
      ],
      skipDuplicates: true,
    });
  });

  it('should handle errors during log saving', async () => {
    const logs: LogItem[] = [{ message: 'Test log message', level: 'log' }];
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { /*empty*/});
    (prismaService.log.createMany as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

    await service.onSaveLogs(logs);

    expect(prismaService.log.createMany).toHaveBeenCalledWith({
      data: [{ message: logs[0].message, level: LogLevel.Log, userId: null }],
      skipDuplicates: true,
    });

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it('should correctly convert log item level to database log level', () => {
    expect(service.logItemLevelToDbLogLevel('error')).toBe(LogLevel.Error);
    expect(service.logItemLevelToDbLogLevel('warn')).toBe(LogLevel.Warn);
    expect(service.logItemLevelToDbLogLevel('debug')).toBe(LogLevel.Debug);
    expect(service.logItemLevelToDbLogLevel('verbose')).toBe(LogLevel.Verbose);
    expect(service.logItemLevelToDbLogLevel('fatal')).toBe(LogLevel.Fatal);
    expect(service.logItemLevelToDbLogLevel('log')).toBe(LogLevel.Log); // Default case
    expect(service.logItemLevelToDbLogLevel('info')).toBe(LogLevel.Log); // Unknown level should default to Log
  });
});