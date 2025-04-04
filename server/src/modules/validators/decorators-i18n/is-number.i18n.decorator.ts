import { ValidationOptions } from "class-validator/types/decorator/ValidationOptions";
import { i18nValidationMessage } from "nestjs-i18n";
import { IsNumber } from "class-validator";
import { I18nTranslations } from "../../../generated/i18n.generated";
import { IsNumberOptions } from "class-validator/types/decorator/typechecker/IsNumber";

/**
 * A custom decorator that extends the built-in `@IsNumber` validator from class-validator.
 * It automatically sets the validation error message using the `i18nValidationMessage`
 * function to provide internationalized error messages.
 *
 * This decorator ensures that a property is a valid number and provides a translated error
 * message if the validation fails.
 *
 * @param options - Optional validation options to pass to the underlying `@IsNumber` decorator.
 * These options allow you to customize the numeric validation (e.g., allowNaN, allowInfinity).
 *
 * @param validationOptions - Additional validation options. Currently, only the `message`
 * option is used to override the default internationalized error message.
 *
 * @returns A property decorator function that applies the number validation with
 * internationalization.
 *
 * @example
 * class MyDto {
 *   @IsNumberI18n()
 *   myNumberField: number;
 * }
 */
export function IsNumberI18n(options?: IsNumberOptions, validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    const optionsWithMessage: ValidationOptions = {
      message: i18nValidationMessage<I18nTranslations>('validation.is_number'),
      ...validationOptions,
    };
    IsNumber(options, optionsWithMessage)(object, propertyName);
  };
}