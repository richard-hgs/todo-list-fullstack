import { Injectable } from "@nestjs/common";

@Injectable()
export class ConfigService {
  getEnv<T>(key: string): T {
    return process.env[key] as T;
  }

  getApiEntryPoint(): string {
    const protocol = this.getEnv("NODE_ENV") === "production" ? "https" : "http";
    return `${protocol}://${this.getEnv("HOST") || "localhost"}:${this.getEnv("PORT") || 3000}`;
  }

  isUnitTestRunning(): boolean {
    return this.getEnv("JEST_WORKER_ID") !== undefined;
  }
}