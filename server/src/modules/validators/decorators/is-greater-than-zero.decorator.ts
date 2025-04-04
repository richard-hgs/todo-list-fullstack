import { registerDecorator, ValidationOptions } from "class-validator";
import { IsGreaterThanZeroValidator } from "../validators/is-greater-than-zero.validator";

/**
 * Decorator that checks if a numeric value is greater than zero.
 *
 * @param {ValidationOptions} [validationOptions] - Optional configuration options for validation.
 *
 * @example
 * ```typescript
 * class MyDto {
 *   @IsGreaterThanZero({ message: 'Value must be greater than zero.' })
 *   quantity: number;
 * }
 * ```
 */
export function IsGreaterThanZero(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name        : 'IsGreaterThanZero',
      target      : object.constructor,
      propertyName: propertyName,
      constraints : [],
      options     : validationOptions,
      validator   : IsGreaterThanZeroValidator
    });
  }
}