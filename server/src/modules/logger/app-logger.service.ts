import { Injectable } from "@nestjs/common";
import { LoggerService, LogLevel } from "@nestjs/common/services/logger.service";
import { PrismaBaseService } from "../prisma/prisma-base.service";
import { AppConsoleLogger } from "./app-console-logger";
import { LogItem } from "../../types/log-item";
import { Log, LogLevel as PrismaLogLevel } from "@prisma/client";

@Injectable()
export class AppLoggerService extends AppConsoleLogger implements LoggerService {
  constructor(
    private readonly prismaService: PrismaBaseService
  ) {
    super()
  }

  debug(message: any, ...optionalParams: any[]): any {
    super.debug(message, ...optionalParams);
  }

  error(message: any, ...optionalParams: any[]): any {
    super.error(message, ...optionalParams);
  }

  fatal(message: any, ...optionalParams: any[]): any {
    super.error(message, ...optionalParams);
  }

  log(message: any, ...optionalParams: any[]): any {
    super.log(message, ...optionalParams);
  }

  verbose(message: any, ...optionalParams: any[]): any {
    super.verbose(message, ...optionalParams);
  }

  warn(message: any, ...optionalParams: any[]): any {
    super.warn(message, ...optionalParams);
  }

  setLogLevels(levels: LogLevel[]): any {}

  onSaveLogs(logs: LogItem[]) {
    const dbLogs: Log[] = [];

    logs.forEach((item) => {
      const userIdRegex = /\[user (\d+)]/;
      const match = item.message.match(userIdRegex);
      let userId = undefined;
      if (match) {
        userId = Number(match[1]); // Access the captured group (the user ID)
      }
      dbLogs.push({
        userId: userId ?? null,
        message: item.message,
        level: this.logItemLevelToDbLogLevel(item.level)
      } as Log)
    });

    this.prismaService.log.createMany({
      data: dbLogs,
      skipDuplicates: true,
    }).catch((e) => {
      console.error(e);
    })
  }

  logItemLevelToDbLogLevel(level: string): PrismaLogLevel {
    switch(level) {
      case "error":
        return PrismaLogLevel.Error;
      case "warn":
        return PrismaLogLevel.Warn;
      case "debug":
        return PrismaLogLevel.Debug;
      case "verbose":
        return PrismaLogLevel.Verbose;
      case "fatal":
        return PrismaLogLevel.Fatal;
      default:
        return PrismaLogLevel.Log;
    }
  }
}