import { BadRequestException, forwardRef, HttpException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "../config/config.service";
import { splitNumChar } from "../../utils/regex";
import moment from "moment/moment";
import { DurationInputArg2 } from "moment";
import { OtpUseCase, Prisma, UserStatus } from "@prisma/client";
import { PrismaBaseService } from "../prisma/prisma-base.service";
import { I18nService } from "nestjs-i18n";
import { I18nTranslations } from "../../generated/i18n.generated";
import { UsersService } from "../users/users.service";

/**
 * Provides methods for managing One-Time Passwords (OTPs).
 */
@Injectable()
export class OtpService {

  constructor(
    private readonly prismaService: PrismaBaseService,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly i18nService: I18nService<I18nTranslations>
  ) {}

  /**
   * Creates a new OTP record in the database.
   *
   * @param userId The ID of the user associated with the OTP.
   * @param useCase The intended use case for the OTP (e.g., "verification", "password_reset").
   * @param length The desired length of the OTP (defaults to the value from the "OTP_LENGTH" environment variable).
   * @param duration The duration for which the OTP is valid (defaults to the value from the "OTP_EXPIRES_IN" environment variable).
   * @returns A Promise that resolves to the created OTP record.
   */
  async create(
    userId: number,
    useCase: OtpUseCase,
    length: number = this.configService.getEnv("OTP_LENGTH"),
    duration: string = this.configService.getEnv("OTP_EXPIRES_IN")
  ) {
    const otpPayload: Prisma.OtpUncheckedCreateInput = {
      userId: userId,
      code: this.generateOTP(length),
      useCase: useCase,
      expiresAt: this.getExpiry(duration),
    };

    // Delete old otp for given user to avoid multiple valid otp, and improve security
    await this.prismaService.otp.deleteMany({
      where: {
        userId,
        useCase
      }
    } as any)

    return this.prismaService.otp.create({
      data: otpPayload,
    });
  }

  /**
   * Validates an OTP code.
   *
   * @param userId The ID of the user associated with the OTP.
   * @param otpCode The OTP code to validate.
   * @returns A Promise that resolves to the OTP info if valid.
   * @throws BadRequestException if the OTP code is invalid, expired, or not found.
   */
  async validate(
    userId: number,
    otpCode: string
  ) {
    const otpInfo = await this.prismaService.otp.findFirst({
      where: {
        userId,
        code: otpCode
      }
    });

    if (!otpInfo) {
      throw new BadRequestException(this.i18nService.t("errors.unable_to_validate_otp_code"));
    }

    if (this.isTokenExpired(otpInfo.expiresAt)) {
      throw new BadRequestException(this.i18nService.t("errors.otp_code_expired"));
    }

    return otpInfo;
  }

  /**
   * Deletes an OTP record.
   *
   * @param id The ID of the OTP record to delete.
   * @param userId The ID of the user associated with the OTP.
   * @param otpCode The OTP code.
   * @returns A Promise that resolves to the deleted OTP record.
   * @throws If the OTP record is not found or if there is an error during deletion.
   */
  async delete(id: number, userId: number, otpCode: string) {
    return this.prismaService.otp.delete({
      where: {
        id,
        userId,
        code: otpCode
      }
    })
  }

  /**
   * Verifies a provided OTP code for a specific use case, handles the associated use case,
   * and manages OTP deletion upon successful verification.
   *
   * This method orchestrates the OTP verification process:
   * 1. It delegates the actual validation of the OTP code to the `OtpService`.
   * 2. Upon successful validation, it determines the intended use case of the OTP
   *    based on the `useCase` parameter.  Currently, only `OtpUseCase.AccountActivation` is supported.
   * 3. If the use case is `OtpUseCase.AccountActivation`:
   *    - It calls the `setEmailActivation` method of the `UsersService` to activate the user's account.
   *    - It then proceeds to delete the used OTP from the system using the `delete` method of the `OtpService`.
   * 4. If the use case is not recognized (invalid), a `BadRequestException` is thrown with an
   *    internationalized error message indicating an invalid OTP use case.
   *
   * @param userId The ID of the user for whom the OTP is being verified.
   * @param otpCode The OTP code provided by the user for verification.
   * @param useCase The intended use case for the OTP (e.g., AccountActivation).
   * @returns A Promise that resolves with the updated user entity after successful OTP verification and account activation.
   * @throws {BadRequestException} If the OTP use case is invalid or not recognized, or if OTP validation fails.
   * @async
   */
  async verifyOtp(
    userId: number,
    otpCode: string,
    useCase: OtpUseCase
  ) {
    const otp = await this.validate(userId, otpCode);

    const user = await this.prismaService.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new HttpException("User not found.", 400);
    }

    if (user.status === UserStatus.Blocked) {
      throw new HttpException(`Unable to verify OTP. User is ${user.status}`, 400);
    }

    if (otp.useCase === OtpUseCase.AccountActivation) {
      const user = this.usersService.setEmailActivation(userId, true);
      await this.delete(otp.id, userId, otpCode);
      return user;
    } else {
      throw new BadRequestException(this.i18nService.t("errors.invalid_otp_use_case"));
    }
  }

  async resendOtp(
    userEmail: string,
    useCase: OtpUseCase
  ) {
    if (useCase === OtpUseCase.AccountActivation) {
      await this.usersService.resendEmailActivationCode(userEmail)
    }
  }

  /**
   * Calculates an expiry date based on a provided duration string.
   *
   * @param duration A string representing the duration until expiry, e.g., "30m", "1h", "2d".
   *                 It must consist of a number followed by a time unit character (m for minutes, h for hours, d for days).
   * @returns A Date object representing the calculated expiry date.
   */
  private getExpiry(duration: string) {
    const {num, char} = splitNumChar(duration);
    const createdAt = new Date();
    return moment(createdAt).add(num, char as DurationInputArg2).toDate();
  }

  /**
   * Checks if a token is expired.
   *
   * @param expiry The expiration date of the token.
   * @returns `true` if the token is expired, `false` otherwise.
   */
  private isTokenExpired(expiry: Date): boolean {
    const expirationDate = new Date(expiry);
    const currentDate = new Date();
    return expirationDate.getTime() <= currentDate.getTime();
  }

  /**
   * Generates a random One-Time Password (OTP) of a specified length.
   *
   * @param length The desired length of the OTP.
   * @param digits The string containing characters to use for generating the OTP (default is "0123456789").
   * @returns The generated OTP string.
   */
  private generateOTP(length: number, digits: string = "0123456789") {
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * digits.length)];
    }
    return otp;
  }
}