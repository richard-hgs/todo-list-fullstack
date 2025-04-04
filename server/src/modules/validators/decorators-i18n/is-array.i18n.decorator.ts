import { ValidationOptions } from "class-validator/types/decorator/ValidationOptions";
import { i18nValidationMessage } from "nestjs-i18n";
import { IsArray } from "class-validator";
import { I18nTranslations } from "../../../generated/i18n.generated";

/**
 * A custom decorator that extends the built-in `@IsArray` validator from class-validator.
 * It automatically sets the validation error message using the `i18nValidationMessage`
 * function to provide internationalized error messages.
 *
 * @param validationOptions - Optional validation options to pass to the underlying `@IsArray` decorator.
 * @returns A property decorator function.
 */
export function IsArrayI18n(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string | symbol) {
    const optionsWithMessage: ValidationOptions = {
      message: i18nValidationMessage<I18nTranslations>('validation.is_array'),
      ...validationOptions,
    };
    IsArray(optionsWithMessage)(object, propertyName);
  };
}