import { AcceptLanguageResolver, I18nModule, QueryResolver } from "nestjs-i18n";
import { ConfigService } from "../config/config.service";
import { ResourcesService } from "../resources/resources.service";
import path from "path";
import { ConfigModule } from "../config/config.module";
import { ResourcesModule } from "../resources/resources.module";
import { DynamicModule } from "@nestjs/common";


export function i18nModuleFactory(): DynamicModule {
  return I18nModule.forRootAsync({
    useFactory: (
      configService: ConfigService,
      resourcesService: ResourcesService
    ) => {
      return ({
        fallbackLanguage: configService.getEnv("I18N_FALLBACK_LANGUAGE"),
        loaderOptions: {
          path: resourcesService.getI18nDir(),
          watch: true,
        },
        typesOutputPath: path.join(resourcesService.getGeneratedDir(), '/i18n.generated.ts'),
        // formatter: (template: string, ...args: unknown[]) => template,
      })
    },
    imports: [ConfigModule, ResourcesModule],
    inject: [ConfigService, ResourcesService],
    resolvers: [
      new QueryResolver(['lang']),
      new AcceptLanguageResolver(),
    ]
  })
}