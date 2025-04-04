import { Test, TestingModule } from "@nestjs/testing";
import { ResourcesService } from "./resources.service";
import path from "path";
import { ConfigService } from "../config/config.service";
import { mockConfigService } from "../../utils/tests/utils";

describe("Resources Service tests", () => {
  let service: ResourcesService;
  let configService: ConfigService;

  beforeEach(async () => {
    const configServiceMock = await mockConfigService();
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        ResourcesService,
        {
          provide: ConfigService,
          useValue: {
            ...configServiceMock,
            isUnitTestRunning: jest.fn().mockReturnValue(configServiceMock.isUnitTestRunning())
          }
        }
      ],
    }).compile();

    service = app.get<ResourcesService>(ResourcesService);
    configService = app.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("getRootDir", () => {
    it('should correctly resolve the root directory', () => {
      const expectedDir = path.normalize(`${__dirname}/../../../dist`);
      expect(service.getRootDir()).toBe(expectedDir);
    });
  });

  describe("getRootDir outside unit test", () => {
    it('should correctly resolve the root directory', () => {
      (configService.isUnitTestRunning as jest.Mock).mockReturnValue(false);

      const expectedDir = path.normalize(`${__dirname}/../..`);
      expect(service.getRootDir()).toBe(expectedDir);
    });
  });

  describe("getSourceDir", () => {
    it('should correctly resolve the source directory', () => {
      const expectedDir = path.normalize(`${__dirname}/../..`);
      expect(service.getSourceDir()).toBe(expectedDir);
    });
  });

  describe("getAssetsDir", () => {
    it('should correctly resolve the assets directory', () => {
      const expectedDir = path.normalize(`${__dirname}/../../../dist/assets`);
      expect(service.getAssetsDir()).toBe(expectedDir);
    });
  });

  describe("getI18nDir", () => {
    it('should correctly resolve the i18n asset directory', () => {
      const expectedDir = path.normalize(`${__dirname}/../../../dist/assets/i18n`);
      expect(service.getI18nDir()).toBe(expectedDir);
    });
  });

  describe("getI18nDirName", () => {
    it('should correctly resolve the i18n asset directory', () => {
      const expectedDir = "i18n";
      expect(service.getI18nDirName()).toBe(expectedDir);
    });
  });

  describe("getGeneratedDir", () => {
    it('should correctly resolve the generated directory', () => {
      const expectedDir = path.normalize(`${__dirname}/../../generated`);
      expect(service.getGeneratedDir()).toBe(expectedDir);
    });
  });

  describe("getAssetFile", () => {
    it('should correctly resolve the generated directory', () => {
      expect(service.getAssetFile("/i18n/en-US/all.json").byteLength).toBeGreaterThan(0);
    });
  });

  describe("getUploadedDir", () => {
    it('should correctly resolve the generated directory', () => {
      const expectedDir = path.normalize(`${__dirname}/../../../dist/uploaded`);
      expect(service.getFileUploadDir()).toBe(expectedDir);
    });
  });

  describe("getPublicFileUploadPath", () => {
    it('should correctly resolve the generated directory', () => {
      const sampleFile = path.normalize(`${service.getFileUploadDir()}/sample/file.txt`);
      const expectedDir = `/sample/file.txt`;
      expect(service.getPublicFileUploadPath(sampleFile)).toBe(expectedDir);
    });
  });

  describe("fromPublicFileUploadPath", () => {
    it('should correctly resolve the generated directory', () => {
      const expectedFile = path.normalize(`${service.getFileUploadDir()}/sample/file.txt`);
      const samplePublicFile = service.getPublicFileUploadPath(expectedFile);
      expect(service.fromPublicFileUploadPath(samplePublicFile)).toBe(expectedFile);
    });
  });
});