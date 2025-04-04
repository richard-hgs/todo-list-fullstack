import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";


@ValidatorConstraint({ name: 'IsNonZero' })
@Injectable()
export class IsNonZeroValidator implements ValidatorConstraintInterface {
  defaultMessage(validationArguments?: ValidationArguments): string {
    return "Number must be non-zero.";
  }

  validate(value: any, validationArguments?: ValidationArguments): boolean {
    return typeof value === 'number' && value !== 0; // Checks if it's a number AND not zero.
  }
}