import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PrismaBaseModule } from '../prisma/prisma-base.module';
import { ConfigModule } from "../config/config.module";
import { ConfigService } from "../config/config.service";
import { JwtStrategy } from "./jwt.strategy";
import { UsersModule } from "../users/users.module";

/**
 * AuthModule handles user authentication and JWT management.
 *
 * - PrismaModule: Import PrismaModule for database interactions
 * - PassportModule: Import PassportModule for authentication strategies
 * - ConfigModule: Import ConfigModule to access environment variables
 * - JwtModule.registerAsync: Configure JwtModule asynchronously
 *   - imports: Import ConfigModule for use in the factory
 *   - inject: Inject ConfigService to access environment variables
 *   - useFactory: Asynchronous factory function that:
 *     - configService: Receives the `configService` imported earlier.
 *       - secret: Get JWT secret from environment variables
 *       - signOptions:
 *         - expiresIn: Get JWT expiration time from environment variables
 *
 * - controllers: Declare AuthController for authentication routes
 * - providers: Provide AuthService for authentication logic
 */
@Module({
  imports: [
    PrismaBaseModule,
    PassportModule,
    ConfigModule,
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return ({
          secret: configService.getEnv("JWT_SECRET"),
          signOptions: { expiresIn: configService.getEnv("JWT_EXPIRES_IN") }, // e.g. 30s, 5m, 7d, 24h
        })
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, ConfigService, JwtStrategy],
})
export class AuthModule {}