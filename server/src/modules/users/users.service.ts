import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { PrismaBaseService } from "../prisma/prisma-base.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import bcrypt from "bcrypt";
import { ConfigService } from "../config/config.service";
import { MailService } from "../mail/mail.service";
import { OtpService } from "../otp/otp.service";
import { OtpUseCase, UserStatus } from "@prisma/client";
import { I18nService } from "nestjs-i18n";
import { I18nTranslations } from "../../generated/i18n.generated";

@Injectable()
export class UsersService {

  private readonly roundsOfHashing: number;

  constructor(
    private readonly prisma: PrismaBaseService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    @Inject(forwardRef(() => OtpService))
    private readonly otpService: OtpService,
    private readonly i18nService: I18nService<I18nTranslations>
  ) {
    this.roundsOfHashing = Number(this.configService.getEnv("BCRYPT_ROUNDS_HASHING"));
  }

  /**
   * Creates a new user.
   *
   * Hashes the user's password using bcrypt.
   * Finds the app associated with the provided `appType`.
   * Creates the user record in the database.
   * Sends an email activation code to the newly created user.
   *
   * @param createUserDto The data for the new user.
   * @returns The created user.
   * @throws HttpException if the specified `appType` is not found.
   */
  async create(createUserDto: CreateUserDto) {
    return await this.prisma.$transaction(async () => {
      createUserDto.password = await bcrypt.hash(
        createUserDto.password,
        this.roundsOfHashing,
      );

      const { passwordConfirm, ...userInfo} = createUserDto;

      // Create user
      const createdUser = await this.prisma.user.create({
        data: {
          name: userInfo.name,
          email: userInfo.email,
          password: userInfo.password
        },
      });

      // Send user email activation code
      await this.resendEmailActivationCode(createdUser.email);

      return createdUser;
    });

  }

  /**
   * Retrieves all users from the database.
   *
   * @returns A Promise that resolves to an array of user objects.
   */
  findAll() {
    return this.prisma.user.findMany();
  }

  /**
   * Retrieves a single user by ID.
   *
   * @param id The ID of the user to retrieve.
   * @returns A Promise that resolves to the user object, or null if not found.
   */
  findOneById(id: number) {
    return this.prisma.user.findUnique({ where: { id }});
  }

  /**
   * Finds a single user by their email address.
   *
   * @param email The email address of the user to find.
   * @returns A Promise that resolves to the found user or null if no user with the provided email exists.
   */
  findOneByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email }});
  }

  /**
   * Updates an existing user.
   *
   * Hashes the provided password (if any) using bcrypt before updating the user in the database.
   *
   * @param id The ID of the user to update.
   * @param updateUserDto The data to update the user with.
   * @returns A Promise that resolves to the updated user object.
   */
  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        this.roundsOfHashing,
      );
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });

    return user;
  }

  /**
   * Sets the email activation status for a user.
   *
   * Updates the `isEmailActivated` and `status` fields for the user in the database.
   *
   * @param id The ID of the user to update.
   * @param activated The new email activation status (true for activated, false for deactivated).
   * @returns A Promise that resolves to the updated user object.
   */
  async setEmailActivation(id: number, activated: boolean) {
    // Update user in base service
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        isEmailActivated: activated,
        status: UserStatus.Active
      }
    });

    return user;
  }

  /**
   * Deletes a user by ID.
   *
   * @param id The ID of the user to delete.
   * @returns A Promise that resolves to the deleted user object.
   */
  remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }

  /**
   * Resends the email activation code to a user.
   *
   * Generates a new OTP (One-Time Password) for account activation and sends it to the user's email address.
   *
   * @param email The email of the user to resend the activation code to.
   * @returns A Promise that resolves to the result of the email sending operation (e.g., a success message or an error object).
   */
  async resendEmailActivationCode(email: string) {
    const user = await this.findOneByEmail(email);

    if (!user) {
      throw new BadRequestException(this.i18nService.t("errors.user_not_found"));
    }

    const otp = await this.otpService.create(
      user.id,
      OtpUseCase.AccountActivation
    );

    return this.mailService.sendActivationCodeMail(
      user.id,
      user.name,
      user.email,
      otp.code
    );
  }
}