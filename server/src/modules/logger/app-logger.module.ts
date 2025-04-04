import { Module } from "@nestjs/common";
import { AppLoggerService } from "./app-logger.service";
import { PrismaBaseModule } from "../prisma/prisma-base.module";


@Module({
  imports: [PrismaBaseModule],
  providers: [AppLoggerService],
  exports: [AppLoggerService]
})
export class AppLoggerModule {}