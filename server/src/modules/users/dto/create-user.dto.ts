import { ApiProperty } from '@nestjs/swagger';
import { MinLength } from 'class-validator';
import { IsNotEmptyI18n } from "../../validators/decorators-i18n/is-not-empty.i18n.decorator";
import { DontExistsI18n } from "../../validators/decorators-i18n/dont-exists.i18n.decorator";
import { IsStringI18n } from "../../validators/decorators-i18n/is-string.i18n.decorator";
import { MaxLengthI18n } from "../../validators/decorators-i18n/max-length.i18n.decorator";
import { MinLengthI18n } from "../../validators/decorators-i18n/min-length.i18n.decorator";
import { MatchI18n } from "../../validators/decorators-i18n/match.18n.decorator";

/**
 * CreateUserDto defines the structure and validation rules for a request payload
 * used to create a new user.
 */
export class CreateUserDto {
  @IsStringI18n()
  @IsNotEmptyI18n()
  @MaxLengthI18n(50)
  @DontExistsI18n("user")
  @ApiProperty({
    description: "User name",
    example: "Test User"
  })
  name: string;

  @IsStringI18n()
  @IsNotEmptyI18n()
  @MaxLengthI18n(50)
  @DontExistsI18n("user")
  @ApiProperty({
    description: "User email",
    example: "testes@testes.com"
  })
  email: string;

  @IsStringI18n()
  @IsNotEmptyI18n()
  @MinLength(6)
  @MaxLengthI18n(50)
  @ApiProperty({
    description: "User password",
    example: "12345678"
  })
  password: string;

  @IsStringI18n()
  @IsNotEmptyI18n()
  @MinLengthI18n(8)
  @MaxLengthI18n(50)
  @MatchI18n('password')
  @ApiProperty({
    description: "User password confirmation",
    example: "12345678"
  })
  passwordConfirm: string;
}