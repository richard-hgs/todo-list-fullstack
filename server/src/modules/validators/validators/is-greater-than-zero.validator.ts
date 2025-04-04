import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";


@ValidatorConstraint({ name: 'IsGreaterThanZero' })
@Injectable()
export class IsGreaterThanZeroValidator implements ValidatorConstraintInterface {
  defaultMessage(validationArguments?: ValidationArguments): string {
    return "Number must be greater than zero.";
  }

  validate(value: any, validationArguments?: ValidationArguments): boolean {
    return typeof value === 'number' && value > 0; // Checks if it's a number AND greater than zero.
  }
}