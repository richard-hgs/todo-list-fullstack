import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { ConfigService } from "../config/config.service";

/**
 * JwtStrategy implements a JWT (JSON Web Token) authentication strategy.
 *
 * It extends PassportStrategy, using the 'jwt' strategy from passport-jwt.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {

  /**
   * Constructor for the JwtStrategy.
   *
   * Injects dependencies and configures the JWT strategy.
   *
   * @param usersService - The UsersService used to retrieve user information.
   * @param configService - The ConfigService to access environment variables.
   */
  constructor(private usersService: UsersService, private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getEnv("JWT_SECRET"),
    });
  }

  /**
   * Validates the JWT payload and returns the user object if successful.
   *
   * @param payload - The decoded JWT payload containing user information.
   * @returns A Promise that resolves to the UserEntity if validation is successful.
   * @throws UnauthorizedException if the user is not found or validation fails.
   */
  async validate(payload: { userId: number }) {
    const user = await this.usersService.findOneById(payload.userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}