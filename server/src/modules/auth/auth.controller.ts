import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
  ApiUnauthorizedResponse, refs
} from '@nestjs/swagger';
import { AuthEntity } from './entity/auth.entity';
import { LoginDto } from './dto/login.dto';
import { HttpErrorEntity } from "../error/http-error.entity";

/**
 * AuthController handles user authentication.
 */
@Controller('auth')
@ApiTags('auth')
export class AuthController {

  /**
   * Controller responsible for handling authentication and authorization-related routes.
   *
   * This controller provides endpoints for login, user email activation,
   * OTP (One-Time Password) generation and validation, and other authentication flows.
   *
   * The constructor utilizes dependency injection, a fundamental concept in NestJS,
   * to receive and utilize instances of essential services:
   *
   * - `AuthService`: Handles core authentication logic, such as user registration,
   *   login, and password management.
   *
   * @param authService - An instance of the `AuthService` to handle user authentication.
   *
   */
  constructor(
    private readonly authService: AuthService
  ) {}

  /**
   * Handles user login requests.
   *
   * @param email - The user's email address.
   * @param password - The user's password.
   * @param acceptedTerms - List of accepted terms or a empty list
   * @returns An `AuthEntity` containing the authentication token upon successful login.
   */
  @Post('login')
  @ApiCreatedResponse({ type: AuthEntity, description: `User logged in successfully. The token expiry in ${process.env.JWT_EXPIRES_IN}.` })
  @ApiUnauthorizedResponse({
    description: "Unauthorized exception",
    content: {
      'application/json': {
        schema: {
          $ref: refs(HttpErrorEntity)[0].$ref,
        },
        examples: {
          'User email not activated': {
            summary    : 'User email not activated',
            description: 'Example when the user has not activated their email.',
            value      : {
              message   : 'User email not activated.',
              statusCode: 401,
            },
          },
          'No user found for email': {
            summary    : 'User not found for email',
            description: 'Example when the user not found for email.',
            value      : {
              message   : 'No user found for email: email@email.com',
              statusCode: 401,
            },
          },
          'Invalid user status': {
            summary    : 'Invalid user status',
            description: 'Example when the user status is not Active.',
            value      : {
              message   : 'User status is Blocked',
              statusCode: 401,
            },
          },
          'Invalid password': {
            summary    : 'Invalid password',
            description: 'Example when the user password is invalid.',
            value      : {
              message   : 'Invalid password',
              statusCode: 401,
            },
          },
          'User must accept all terms': {
            summary    : 'User must accept all terms',
            description: 'Example when the user did not accepted one of the existing terms and conditions.',
            value      : {
              message   : 'User must accept all terms',
              statusCode: 401,
            },
          }
        }
      }
    }
  })
  @ApiInternalServerErrorResponse({
    type       : HttpErrorEntity,
    description: "Internal server error in case of server errors.",
    example    : {
      "message"   : "Internal server error",
      "statusCode": 500
    }
  })
  login(@Body() { email, password }: LoginDto) {
    return this.authService.login(email, password);
  }
}