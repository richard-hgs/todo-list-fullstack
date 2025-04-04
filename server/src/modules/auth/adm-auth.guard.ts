import { ExecutionContext, HttpStatus, Injectable } from "@nestjs/common";
import { CanActivate } from "@nestjs/common/interfaces";
import { Request, Response } from "express";
import { User, UserRole } from "@prisma/client";
import { I18nService } from "nestjs-i18n";
import { I18nTranslations } from "../../generated/i18n.generated";

/**
 * AuthGuard for user Admin role.
 */
@Injectable()
export class AdmAuthGuard implements CanActivate {

  /**
   * Constructor injector.
   *
   * @param i18nService - The I18nService to use for translating text.
   */
  constructor(private readonly i18nService: I18nService<I18nTranslations>) {}

  /**
   * Checks if the request is authenticated and if the user has the Admin role.
   * @param context The execution context.
   * @returns A Promise that resolves to `true` if the user is authorized, `false` otherwise.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const httpArgs = context.switchToHttp();
    const httpReq = httpArgs.getRequest<Request>();
    const httpUser = httpReq.user as User;

    if (!httpUser) {
      httpArgs.getResponse<Response>().status(HttpStatus.UNAUTHORIZED).json({
        message: this.i18nService.t("http-error.401.default"),
        statusCode: HttpStatus.UNAUTHORIZED
      }).send();
      return false;
    }

    if (httpUser.role === UserRole.Root) {
      return true;
    } else {
      httpArgs.getResponse<Response>().status(HttpStatus.UNAUTHORIZED).json({
        message: `${this.i18nService.t("http-error.401.no_access")} (${httpUser.role})`,
        statusCode: HttpStatus.UNAUTHORIZED
      }).send();
      return false;
    }
  }
}