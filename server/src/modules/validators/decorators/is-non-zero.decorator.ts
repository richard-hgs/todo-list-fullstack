import { registerDecorator, ValidationOptions } from "class-validator";
import { IsNonZeroValidator } from "../validators/is-non-zero.validator";

/**
 * Decorator that checks if a numeric value is non-zero.
 *
 * @param {ValidationOptions} [validationOptions] - Optional configuration options for validation.
 *
 * @example
 * ```typescript
 * class MyDto {
 *   @IsNonZero({ message: 'Value must be non-zero.' })
 *   value: number;
 * }
 * ```
 */
export function IsNonZero(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name        : 'IsNonZero',
      target      : object.constructor,
      propertyName: propertyName,
      constraints : [],
      options     : validationOptions,
      validator   : IsNonZeroValidator
    });
  }
}