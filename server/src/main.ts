import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from "./modules/config/config.service";
import { useContainer } from "class-validator";
import { ResourcesService } from "./modules/resources/resources.service";
import { I18nValidationExceptionFilter, I18nValidationPipe } from "nestjs-i18n";
import { ConditionalSerializerInterceptor } from "./modules/interceptors/conditional-serializer.interceptor";
import { AppLoggerService } from "./modules/logger/app-logger.service";
import { AppLoggerDispatcher } from "./modules/logger/app-logger-dispatcher";

/**
 * Bootstraps the NestJS application.
 *
 * This function sets up the application:
 * - Initializes the NestJS application using the AppModule.
 * - Configures global pipes and interceptors.
 * - Sets up Swagger documentation.
 * - Starts the application listening on the specified port.
 *
 * @param useDispatcherBuffer defaults to (false). All logs will be printed into console before logger service is instantiated.
 * This is needed because when a injection error occurs the logs with error will not be printed.
 */
export async function bootstrap(useDispatcherBuffer = false): Promise<any> {
  let appLoggerService: AppLoggerService;
  const appLogger = new AppLoggerDispatcher(() => appLoggerService, useDispatcherBuffer);
  const app = await NestFactory.create(AppModule, {
    logger: appLogger
  });
  const configService = app.get<ConfigService>(ConfigService);
  const resourcesService = app.get<ResourcesService>(ResourcesService);
  appLoggerService = app.get<AppLoggerService>(AppLoggerService);
  appLogger.dispatchBufferLogs();

  app.enableShutdownHooks(); // Enable listening for shutdown hooks

  // Enable data validation for all incoming requests
  app.useGlobalPipes(
    // new ValidationPipe({ whitelist: true }),
    new I18nValidationPipe({whitelist: true})
  );

  // Use filters globally to translate error messages through i18n
  app.useGlobalFilters(new I18nValidationExceptionFilter({detailedErrors: false}));

  // Use ClassSerializerInterceptor globally to format responses
  app.useGlobalInterceptors(
    new ConditionalSerializerInterceptor(
      app.get(Reflector)
    )
  );

  // Allow all sources
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: '*',
  });

  // Set default container in case a container is not provided by a module.
  useContainer(app.select(AppModule), {fallbackOnErrors: true});

  // Configure Swagger (OpenAPI) documentation
  const config = new DocumentBuilder()
    .setTitle('TodoList Fullstack')
    .setDescription('TodoList Fullstack API Documentation')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addGlobalParameters({
      in         : "header",
      required   : false,
      name       : "Accept-Language",
      example    : "en-US",
      description: "Language accepted as answer for a request."
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    customCss     : resourcesService.getAssetFile("swagger/dark-theme.css").toString(),
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = configService.getEnv<number | undefined>("PORT") || 3000;
  return await app.listen(port, () => appLogger.log(`\nApplication listening on port ${port}\n`));
}

// noinspection JSIgnoredPromiseFromCall
bootstrap();