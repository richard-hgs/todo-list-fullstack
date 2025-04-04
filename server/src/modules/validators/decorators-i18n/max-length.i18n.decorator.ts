import { ValidationOptions } from "class-validator/types/decorator/ValidationOptions";
import { i18nValidationMessage } from "nestjs-i18n";
import { I18nTranslations } from "../../../generated/i18n.generated";
import { MaxLength } from "class-validator";


/**
 * A custom decorator that extends the built-in `@MaxLength` validator from class-validator.
 * It automatically sets the validation error message using the `i18nValidationMessage`
 * function to provide internationalized error messages.
 *
 * @param max The maximum length allowed for property value.
 * @param validationOptions - Optional validation options to pass to the underlying `@MaxLength` decorator.
 * @returns A property decorator function.
 */
export function MaxLengthI18n(max: number, validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    const optionsWithMessage: ValidationOptions = {
      message: i18nValidationMessage<I18nTranslations>('validation.max_length'),
      ...validationOptions,
    };
    MaxLength(max, optionsWithMessage)(object, propertyName);
  };
}