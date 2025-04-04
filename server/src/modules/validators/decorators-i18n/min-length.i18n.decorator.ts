import { ValidationOptions } from "class-validator/types/decorator/ValidationOptions";
import { i18nValidationMessage } from "nestjs-i18n";
import { I18nTranslations } from "../../../generated/i18n.generated";
import { MinLength } from "class-validator";


/**
 * A custom decorator that extends the built-in `@MinLength` validator from class-validator.
 * It automatically sets the validation error message using the `i18nValidationMessage`
 * function to provide internationalized error messages.
 *
 * @param min The maximum length allowed for property value.
 * @param validationOptions - Optional validation options to pass to the underlying `@MaxLength` decorator.
 * @returns A property decorator function.
 */
export function MinLengthI18n(min: number, validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    const optionsWithMessage: ValidationOptions = {
      message: i18nValidationMessage<I18nTranslations>('validation.min_length'),
      ...validationOptions,
    };
    MinLength(min, optionsWithMessage)(object, propertyName);
  };
}