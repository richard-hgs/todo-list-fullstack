import { LogItem } from "../../types/log-item";

export interface AppDbLoggerInterface {
  onSaveLogs?(logs: LogItem[]): void;
}