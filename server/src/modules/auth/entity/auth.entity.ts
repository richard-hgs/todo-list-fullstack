import { ApiProperty } from '@nestjs/swagger';

/**
 * AuthEntity represents the structure of the authentication response
 * returned after a successful login.
 */
export class AuthEntity {
  @ApiProperty({
    description: `JWT bearer token used by the user to access functionalities that require sign in.`,
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
  })
  accessToken: string;
}