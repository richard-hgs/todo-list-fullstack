import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyI18n } from "../../validators/decorators-i18n/is-not-empty.i18n.decorator";
import { IsStringI18n } from "../../validators/decorators-i18n/is-string.i18n.decorator";
import { MaxLengthI18n } from "../../validators/decorators-i18n/max-length.i18n.decorator";
import { MinLengthI18n } from "../../validators/decorators-i18n/min-length.i18n.decorator";
import { IsEmailI18n } from "../../validators/decorators-i18n/is-email.i18n.decorator";

/**
 * LoginDto defines the structure and validation rules for the user login request payload.
 */
export class LoginDto {
  @IsEmailI18n()
  @IsNotEmptyI18n()
  @ApiProperty({
    description: "User email",
    example: "testes@testes.com"
  })
  email: string;

  @IsStringI18n()
  @IsNotEmptyI18n()
  @MinLengthI18n(8)
  @MaxLengthI18n(50)
  @ApiProperty({
    description: "User password",
    example: "12345678"
  })
  password: string;
}