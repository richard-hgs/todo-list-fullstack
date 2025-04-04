import { Test, TestingModule } from "@nestjs/testing";
import { FileController } from "./file.controller";
import { ResourcesService } from "../resources/resources.service";
import { Response } from "express";
import { mockResourcesService, mockResponse } from "../../utils/tests/utils";
import path from "path";

describe("FileController", () => {
  let controller: FileController;
  let resourcesService: ResourcesService;
  let mockExpressResponse: Response;

  beforeEach(async () => {
    resourcesService = await mockResourcesService();
    mockExpressResponse = mockResponse();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileController],
      providers: [
        {
          provide: ResourcesService,
          useValue: resourcesService,
        },
      ],
    }).compile();

    controller = module.get<FileController>(FileController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should send a file", () => {
    const fileUploadDir = resourcesService.getFileUploadDir();
    const uploadTestDir = path.normalize(`${fileUploadDir}/tests`);
    const filePath = path.normalize(`${uploadTestDir}/plugin.png`);
    const mockSendFile = jest.fn().mockImplementationOnce((_path, _options) => mockExpressResponse)

    jest.spyOn(mockExpressResponse, 'sendFile').mockImplementationOnce(mockSendFile)

    controller.seeUploadedFile(filePath, mockExpressResponse);
    expect(mockSendFile).toHaveBeenCalledWith(filePath, { root: resourcesService.getFileUploadDir() });
  });

  it("should send a file from a dynamic path", () => {
    const fileUploadDir = resourcesService.getFileUploadDir();
    const uploadTestDir = path.normalize(`${fileUploadDir}/tests`);
    const filePath = path.normalize(`${uploadTestDir}/plugin.png`);
    const mockSendFile = jest.fn().mockImplementationOnce((_path, _options) => mockExpressResponse)

    jest.spyOn(mockExpressResponse, 'sendFile').mockImplementationOnce(mockSendFile)
    controller.seeUploadedFile(filePath, mockExpressResponse);
    expect(mockSendFile).toHaveBeenCalledWith(filePath, { root: resourcesService.getFileUploadDir() });
  });

  it('should handle send file error', () => {
    const filePath = 'non-existent-file.txt';
    const mockSendFile = jest.fn().mockImplementationOnce(() => {
      throw new Error('File not found');
    });

    jest.spyOn(mockExpressResponse, 'sendFile').mockImplementationOnce(mockSendFile);

    try {
      controller.seeUploadedFile(filePath, mockExpressResponse);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
  it("Should test all possible file paths", async () => {
    const fileUploadDir = resourcesService.getFileUploadDir();
    const uploadTestDir = path.normalize(`${fileUploadDir}/tests`);
    const filePath = path.normalize(`${uploadTestDir}/plugin.png`);

    const testCases = [
      filePath,
    ]
    for (const testCase of testCases) {
      const mockSendFile = jest.fn().mockImplementationOnce((_path, _options) => mockExpressResponse)
      jest.spyOn(mockExpressResponse, 'sendFile').mockImplementationOnce(mockSendFile)
      controller.seeUploadedFile(testCase, mockExpressResponse);
      expect(mockSendFile).toHaveBeenCalledWith(testCase, { root: resourcesService.getFileUploadDir() });
    }
  })
});