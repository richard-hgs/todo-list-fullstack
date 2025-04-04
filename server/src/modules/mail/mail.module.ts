import { Module } from "@nestjs/common";
import { ConfigModule } from "../config/config.module";
import { MailService } from "./mail.service";
import { ResourcesModule } from "../resources/resources.module";

@Module({
  imports: [ConfigModule, ResourcesModule],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}