import { Module } from "@nestjs/common";
import { ResourcesService } from "./resources.service";
import { ConfigModule } from "../config/config.module";

@Module({
  imports: [ConfigModule],
  providers: [ResourcesService],
  exports: [ResourcesService]
})
export class ResourcesModule {}