import { Test, TestingModule } from '@nestjs/testing';
import { PrismaBaseService } from './prisma-base.service';

/**
 * Unit tests for the PrismaService.
 *
 * These tests ensure that the PrismaService is correctly defined
 * and can be injected into other components.
 */
describe('PrismaBaseService', () => {

  let service: PrismaBaseService;

  /**
   * Sets up the testing module for each test case.
   *
   * This method creates a testing module that includes the `PrismaService`
   * as a provider.
   */
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaBaseService],
    }).compile();

    service = module.get<PrismaBaseService>(PrismaBaseService);
  });

  afterEach(async () => {
    await service.onModuleDestroy();
  });

  /**
   * Tests that the PrismaService is defined.
   *
   * This is a basic sanity check to make sure the service
   * can be created and injected.
   */
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});