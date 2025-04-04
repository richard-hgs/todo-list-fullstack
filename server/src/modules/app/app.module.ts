import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { PrismaBaseModule } from '../prisma/prisma-base.module';
import { AppController } from "./app.controller";
import { AppLoggerMiddleware } from "../logger/app-logger.midleware";
import { ConfigModule } from "../config/config.module";
import { AuthModule } from "../auth/auth.module";
import { UsersModule } from "../users/users.module";
import { DontExistsValidator } from "../validators/validators/dont-exists.validator";
import { AppLoggerModule } from "../logger/app-logger.module";
import { OtpModule } from "../otp/otp.module";
import { i18nModuleFactory } from "../factories/i18n.factory";
import { FileModule } from "../file/file.module";
import { ResourcesModule } from "../resources/resources.module";
import { TodoTaskModule } from "../todotask/todo-task.module";

/**
 * AppModule is the root module of the NestJS application.
 *
 * It sets up the application's:
 * - Module imports: Including other modules needed by this module.
 * - Controllers:  Controllers that handle incoming requests.
 * - Providers: Services or other providers used within this module.
 * - Middleware: Configures middleware for specific routes.
 */
@Module({
  imports: [
    // base
    PrismaBaseModule,
    AuthModule,
    UsersModule,
    OtpModule,
    AppLoggerModule,
    FileModule,
    TodoTaskModule,

    // common
    ConfigModule,
    ResourcesModule,

    // Translation system
    i18nModuleFactory(),
  ],
  controllers: [AppController],
  providers: [DontExistsValidator]
})
export class AppModule implements NestModule {

  /**
   * Configures middleware for the application.
   *
   * This method applies the `AppLoggerMiddleware` to all routes ('*')
   * so that it logs requests.
   *
   * @param consumer - The MiddlewareConsumer provided by NestJS for middleware configuration.
   */
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
    // consumer.apply(DynamicDbUrlMiddleware).forRoutes('*');
  }
}