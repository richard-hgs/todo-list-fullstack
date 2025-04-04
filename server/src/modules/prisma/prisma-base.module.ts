import { Module } from '@nestjs/common';
import { PrismaBaseService } from './prisma-base.service';

/**
 * PrismaModule provides the PrismaService for database interactions.
 *
 * This module encapsulates the Prisma setup and makes the `PrismaService`
 * available to other modules that need to interact with the database.
 */
@Module({
  providers: [PrismaBaseService],
  exports: [PrismaBaseService],
})
export class PrismaBaseModule {}