import { Body, Controller, Get, HttpException, HttpStatus, Post, Query, Res } from "@nestjs/common";
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { HttpErrorEntity } from "../error/http-error.entity";
import { VerifyOtpDto } from "./dto/verify-otp.dto";
import { UserEntity } from "../users/entity/user.entity";
import { OtpService } from "./otp.service";
import { Response } from "express";
import { ResendOtpDto } from "./dto/resend-otp.dto";

@Controller('otp')
@ApiTags('otp')
export class OtpController {

  constructor(private readonly otpService: OtpService) {}

  @Get("verify")
  @ApiOkResponse()
  @ApiBadRequestResponse({
    type: HttpException,
    description: "User not found | Unable to verify OTP. User status is not Active or Pending",
    example: {
      "message": "Unable to verify OTP. User is Blocked",
      "statusCode": 400
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
  async verifyOtp(@Query() { userId, otpCode, otpUseCase }: VerifyOtpDto) {
    return new UserEntity(await this.otpService.verifyOtp(userId, otpCode, otpUseCase));
  }

  @Post("resend")
  @ApiOkResponse()
  @ApiBadRequestResponse({
    type: HttpException,
    description: "User not found | Unable to verify OTP. User status is not Active or Pending",
    example: {
      "message": "Unable to verify OTP. User is Blocked",
      "statusCode": 400
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
  async resendOtp(@Body() { userEmail, otpUseCase }: ResendOtpDto, @Res() res: Response) {
    await this.otpService.resendOtp(userEmail, otpUseCase);
    return res.status(HttpStatus.OK).send();
  }
}