import { forwardRef, Module } from "@nestjs/common";
import { OtpService } from "./otp.service";
import { PrismaBaseModule } from "../prisma/prisma-base.module";
import { ConfigModule } from "../config/config.module";
import { OtpController } from "./otp.controller";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    PrismaBaseModule, ConfigModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [OtpController],
  providers: [OtpService],
  exports: [OtpService]
})
export class OtpModule {}