import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { forwardRef, Module } from "@nestjs/common";
import { PrismaBaseModule } from "../prisma/prisma-base.module";
import { ConfigModule } from "../config/config.module";
import { MailModule } from "../mail/mail.module";
import { OtpModule } from "../otp/otp.module";

@Module({
  imports: [
    PrismaBaseModule, ConfigModule, MailModule,
    forwardRef(() => OtpModule)
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}