import { INestApplication } from "@nestjs/common";
import { ConfigService } from "./modules/config/config.service";
import { ResourcesService } from "./modules/resources/resources.service";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "./modules/app/app.module";
import {
  dateTimeFormatter,
  getTimestamp,
  mockConfigService,
  mockResourcesService
} from "./utils/tests/utils";
import { bootstrap } from "./main";
import { PrismaBaseService } from "./modules/prisma/prisma-base.service";
import request from "supertest";
import { LoggerService } from "@nestjs/common/services/logger.service";
import { AppLoggerService } from "./modules/logger/app-logger.service";

describe("Server bootstrap test", () => {
  let app: INestApplication;
  let server: any;
  let prismaService: PrismaBaseService;
  let loggerService: LoggerService;
  let stdoutSpy: jest.SpyInstance;
  let stderrSpy: jest.SpyInstance;
  const mockTimestamp = 1678886400000; // Example timestamp (2023-03-15T00:00:00.000Z)

  beforeAll(async () => {
    stdoutSpy = jest.spyOn(process.stdout, "write").mockImplementation();
    stderrSpy = jest.spyOn(process.stderr, "write").mockImplementation();

    process.env.PORT = "0";

    const confMock = await mockConfigService();
    const resMock = await mockResourcesService();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(confMock)
      .overrideProvider(ResourcesService)
      .useValue(resMock)
      .compile();

    app = await moduleFixture.createNestApplication();
    await app.init();

    prismaService = app.get<PrismaBaseService>(PrismaBaseService);
    loggerService = app.get<AppLoggerService>(AppLoggerService)

    jest.spyOn(loggerService, 'getTimestamp' as any).mockReturnValue(dateTimeFormatter.format(mockTimestamp)); // Mock timestamp for consistent testing
    jest.useFakeTimers();
    jest.setSystemTime(mockTimestamp);
  });

  afterAll(async () => {
    stdoutSpy.mockRestore();
    stderrSpy.mockRestore();

    jest.useRealTimers();

    prismaService.$disconnect();
    app.close().catch(() => {});
  });

  it('Should be defined', () => {
    expect(app).toBeDefined();
  });

  it('should retrieve Swagger documentation', async () => {
    process.env.PORT = "3010";

    // Call the bootstrap function
    server = await bootstrap();

    await request(server)
      .get('/swagger')
      .expect(200)
      .expect('Content-Type', "text/html; charset=utf-8");
  });

  it('should retrieve Swagger documentation', async () => {
    process.env.PORT = "";

    // Call the bootstrap function
    server = await bootstrap();

    await request(server)
      .get('/swagger')
      .expect(200)
      .expect('Content-Type', "text/html; charset=utf-8");
  });
});