import { ValidationOptions } from "class-validator/types/decorator/ValidationOptions";
import { i18nValidationMessage } from "nestjs-i18n";
import { IsString } from "class-validator";
import { I18nTranslations } from "../../../generated/i18n.generated";

/**
 * A custom decorator that extends the built-in `@IsString` validator from class-validator.
 * It automatically sets the validation error message using the `i18nValidationMessage`
 * function to provide internationalized error messages.
 *
 * @param validationOptions - Optional validation options to pass to the underlying `@IsString` decorator.
 * @returns A property decorator function.
 */
export function IsStringI18n(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string | symbol) {
    const optionsWithMessage: ValidationOptions = {
      message: i18nValidationMessage<I18nTranslations>('validation.is_string'),
      ...validationOptions,
    };
    IsString(optionsWithMessage)(object, propertyName);
  };
}