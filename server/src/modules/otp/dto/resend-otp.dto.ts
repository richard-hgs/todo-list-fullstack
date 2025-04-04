import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmptyI18n } from "../../validators/decorators-i18n/is-not-empty.i18n.decorator";
import { IsStringI18n } from "../../validators/decorators-i18n/is-string.i18n.decorator";
import { OtpUseCase } from "@prisma/client";
import { IsEmailI18n } from "../../validators/decorators-i18n/is-email.i18n.decorator";

export class ResendOtpDto {
  @IsStringI18n()
  @IsNotEmptyI18n()
  @IsEmailI18n()
  @ApiProperty({
    description: "User email",
    example: "testes@testes.com"
  })
  userEmail: string;

  @IsStringI18n()
  @IsNotEmptyI18n()
  @ApiProperty({
    description: `OTP - OtpUseCase should be one of (${Object.keys(OtpUseCase)})`,
    example: "AccountActivation"
  })
  otpUseCase: OtpUseCase;
}