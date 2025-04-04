import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmptyI18n } from "../../validators/decorators-i18n/is-not-empty.i18n.decorator";
import { IsStringI18n } from "../../validators/decorators-i18n/is-string.i18n.decorator";
import { IsNumberI18n } from "../../validators/decorators-i18n/is-number.i18n.decorator";
import { IsGreaterThanZeroI18n } from "../../validators/decorators-i18n/is-greater-than-zero.i18n.decorator";
import { ParseSafeInt } from "../../validators/decorators/parse-safe-int.pipe.decorator";
import { OtpUseCase } from "@prisma/client";

export class VerifyOtpDto {
  @ParseSafeInt()
  @IsNumberI18n()
  @IsGreaterThanZeroI18n()
  @ApiProperty({
    description: "User id",
    example: "1"
  })
  userId: number;

  @IsStringI18n()
  @IsNotEmptyI18n()
  @ApiProperty({
    description: "OTP - One Time Password sent to SMS or Email.",
    example: "123456"
  })
  otpCode: string;

  @IsStringI18n()
  @IsNotEmptyI18n()
  @ApiProperty({
    description: `OTP - OtpUseCase should be one of (${Object.keys(OtpUseCase)})`,
    example: "AccountActivation"
  })
  otpUseCase: OtpUseCase;
}