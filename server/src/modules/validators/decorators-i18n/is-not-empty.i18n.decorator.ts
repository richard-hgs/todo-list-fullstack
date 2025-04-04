import { ValidationOptions } from "class-validator/types/decorator/ValidationOptions";
import { IsNotEmpty } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";
import { I18nTranslations } from "../../../generated/i18n.generated";

/**
 * A custom decorator that extends the built-in `@IsNotEmpty` validator from class-validator.
 * It automatically sets the validation error message using the `i18nValidationMessage`
 * function to provide internationalized error messages.
 *
 * @param validationOptions - Optional validation options to pass to the underlying `@IsNotEmpty` decorator.
 * @returns A property decorator function.
 */
export function IsNotEmptyI18n(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    const optionsWithMessage: ValidationOptions = {
      message: i18nValidationMessage<I18nTranslations>('validation.is_not_empty'),
      ...validationOptions,
    };
    IsNotEmpty(optionsWithMessage)(object, propertyName);
  };
}