import { ValidationOptions } from "class-validator/types/decorator/ValidationOptions";
import { i18nValidationMessage } from "nestjs-i18n";
import { IsEmail, IsString } from "class-validator";
import { I18nTranslations } from "../../../generated/i18n.generated";
import * as ValidatorJS from "validator";

/**
 * A custom decorator that extends the built-in `@IsEmail` validator from class-validator.
 * It automatically sets the validation error message using the `i18nValidationMessage`
 * function to provide internationalized error messages.
 *
 * @param options - Email options
 * @param validationOptions - Optional validation options to pass to the underlying `@IsEmail` decorator.
 * @returns A property decorator function.
 */
export function IsEmailI18n(options?: ValidatorJS.IsEmailOptions, validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string | symbol) {
    const optionsWithMessage: ValidationOptions = {
      message: i18nValidationMessage<I18nTranslations>('validation.is_email'),
      ...validationOptions,
    };
    IsEmail(options, optionsWithMessage)(object, propertyName);
  };
}