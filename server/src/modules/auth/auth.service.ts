import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaBaseService } from "../prisma/prisma-base.service";
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entity/auth.entity';
import { ConfigService } from "../config/config.service";
import bcrypt from "bcrypt";
import { UserStatus } from "@prisma/client";

/**
 * AuthService handles user authentication and JWT generation.
 */
@Injectable()
export class AuthService {

  private readonly roundsOfHashing: number;

  /**
   * Constructor for the AuthService.
   *
   * Initializes the AuthService by injecting necessary dependencies and configuring
   * bcrypt hashing rounds from environment variables.
   *
   * Injects dependencies required by the service:
   * - `prisma`: Provides database interaction using Prisma ORM for user-related operations.
   * - `jwtService`:  Used for generating and verifying JSON Web Tokens (JWTs) for authentication.
   * - `configService`: Accesses environment variables, specifically `BCRYPT_ROUNDS_HASHING` for configuring bcrypt.
   *
   * @param prisma - The PrismaService instance.
   * @param jwtService - The JwtService instance from NestJS.
   * @param configService - The ConfigService instance used to access environment arguments.
   * @param userTermService - The UserTermService instance used to access accepted user terms info.
   */
  constructor(
    private readonly prisma: PrismaBaseService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.roundsOfHashing = Number(this.configService.getEnv("BCRYPT_ROUNDS_HASHING"));
  }

  /**
   * Attempts to authenticate a user with the provided email and password.
   *
   * If successful, it generates a JWT (JSON Web Token) containing the
   * user's ID and returns it as part of the `AuthEntity`.
   *
   * @param email - The user's email address.
   * @param password - The user's password.
   * @returns A Promise that resolves to an `AuthEntity` containing the JWT.
   * @throws NotFoundException if no user with the given email is found.
   * @throws UnauthorizedException if the password is incorrect.
   */
  async login(email: string, password: string): Promise<AuthEntity> {
    // Step 1: Fetch a user with the given email
    const user = await this.prisma.user.findUnique({ where: { email: email } });

    // If no user is found, throw an error
    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    // If user email is not activated
    if (!user.isEmailActivated) {
      throw new UnauthorizedException(`User email not activated.`);
    }

    // Invalid user status
    if (user.status !== UserStatus.Active) {
      throw new UnauthorizedException(`User status is ${user.status}.`);
    }

    // Step 2: Check if the password is correct
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password,
    );

    // If password does not match, throw an error
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    // Step 3: Generate a JWT containing the user's ID and return it
    return {
      accessToken: this.jwtService.sign({ userId: user.id }),
    };
  }
}