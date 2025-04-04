import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * PrismaService provides a wrapper around PrismaClient,
 * ensuring proper initialization and connection management.
 */
@Injectable()
export class PrismaBaseService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  /**
   * Initializes the PrismaClient instance and connects to the database
   * when the module is initialized.
   */
  async onModuleInit() {
    await this.$connect();
  }

  /**
   * Disconnects from the database when the module is destroyed.
   */
  async onModuleDestroy() {
    await this.$disconnect();
  }
}