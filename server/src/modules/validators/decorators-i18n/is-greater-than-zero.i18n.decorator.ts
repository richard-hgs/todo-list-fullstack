import { ValidationOptions } from "class-validator/types/decorator/ValidationOptions";
import { i18nValidationMessage } from "nestjs-i18n";
import { IsString } from "class-validator";
import { I18nTranslations } from "../../../generated/i18n.generated";
import { IsGreaterThanZero } from "../decorators/is-greater-than-zero.decorator";

/**
 * A custom decorator that extends the built-in `@IsGreaterThanZero` validator from class-validator.
 * It automatically sets the validation error message using the `i18nValidationMessage`
 * function to provide internationalized error messages.
 *
 * @param validationOptions - Optional validation options to pass to the underlying `@IsGreaterThanZero` decorator.
 * @returns A property decorator function.
 */
export function IsGreaterThanZeroI18n(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    const optionsWithMessage: ValidationOptions = {
      message: i18nValidationMessage<I18nTranslations>('validation.is_greater_than_zero'),
      ...validationOptions,
    };
    IsGreaterThanZero(optionsWithMessage)(object, propertyName);
  };
}