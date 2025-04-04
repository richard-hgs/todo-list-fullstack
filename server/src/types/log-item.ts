import { LogLevel } from "@nestjs/common/services/logger.service";

export type LogItem = {
  message: string;
  level: LogLevel;
}