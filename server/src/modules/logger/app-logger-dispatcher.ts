import { AppLoggerService } from "./app-logger.service";
import { LoggerService, LogLevel } from "@nestjs/common/services/logger.service";
import { AppConsoleLogger } from "./app-console-logger";

/**
 * Logger dispatcher used to send logger messages to logger service,
 * which provides access to injectable instances to save logs in files, database, etc.
 */
export class AppLoggerDispatcher implements LoggerService {

  public buffer: { message: any, optionalParams: any[], type: string }[] = [];
  private appConsole;

  constructor(
    private readonly service: () => AppLoggerService | null,
    private readonly useDispatcherBuffer: boolean
  ) {
    this.appConsole = new AppConsoleLogger();
  }

  debug(message: any, ...optionalParams: any[]): any {
    const mService = this.service();
    if (mService) {
      mService.debug(message, ...optionalParams);
    } else {
      if (this.useDispatcherBuffer) {
        // Save into buffer
        this.buffer.push({
          message, optionalParams, type: "debug"
        });
      } else {
        this.appConsole.debug(message, ...optionalParams);
      }
    }
  }

  error(message: any, ...optionalParams: any[]): any {
    const mService = this.service();
    if (mService) {
      mService.error(message, ...optionalParams);
    } else {
      if (this.useDispatcherBuffer) {
        // Save into buffer
        this.buffer.push({
          message, optionalParams, type: "error"
        });
      } else {
        this.appConsole.error(message, ...optionalParams);
      }
    }
  }

  fatal(message: any, ...optionalParams: any[]): any {
    const mService = this.service();
    if (mService) {
      mService.fatal(message, ...optionalParams);
    } else {
      if (this.useDispatcherBuffer) {
        // Save into buffer
        this.buffer.push({
          message, optionalParams, type: "fatal"
        });
      } else {
        this.appConsole.fatal(message, ...optionalParams);
      }
    }
  }

  log(message: any, ...optionalParams: any[]): any {
    const mService = this.service();
    if (mService) {
      mService.log(message, ...optionalParams);
    } else {
      if (this.useDispatcherBuffer) {
        // Save into buffer
        this.buffer.push({
          message, optionalParams, type: "log"
        });
      } else {
        this.appConsole.log(message, ...optionalParams);
      }
    }
  }

  verbose(message: any, ...optionalParams: any[]): any {
    const mService = this.service();
    if (mService) {
      mService.verbose(message, ...optionalParams);
    } else {
      if (this.useDispatcherBuffer) {
        // Save into buffer
        this.buffer.push({
          message, optionalParams, type: "verbose"
        });
      } else {
        this.appConsole.verbose(message, ...optionalParams);
      }
    }
  }

  warn(message: any, ...optionalParams: any[]): any {
    const mService = this.service();
    if (mService) {
      mService.warn(message, ...optionalParams);
    } else {
      if (this.useDispatcherBuffer) {
        // Save into buffer
        this.buffer.push({
          message, optionalParams, type: "warn"
        });
      } else {
        this.appConsole.warn(message, ...optionalParams);
      }
    }
  }

  setLogLevels(levels: LogLevel[]): any {
    const mService = this.service();
    if (mService) {
      mService.setLogLevels(levels);
    }
  }

  dispatchBufferLogs() {
    const mService = this.service();
    if (mService) {
      this.buffer.forEach(({message, optionalParams, type}) => {
        if (type === "debug") {
          mService.debug(message, ...optionalParams);
        } else if (type === "error") {
          mService.error(message, ...optionalParams);
        } else if (type === "fatal") {
          mService.fatal(message, ...optionalParams);
        } else if (type === "log") {
          mService.log(message, ...optionalParams);
        } else if (type === "verbose") {
          mService.verbose(message, ...optionalParams);
        } else if (type === "warn") {
          mService.warn(message, ...optionalParams);
        }
      });
    }
    this.buffer = [];
  }
}