import { LogLevel } from "@nestjs/common/services/logger.service";

export type LoggerInterceptor = (level: LogLevel, msg: unknown, ...optionalParams: any[]) => boolean;