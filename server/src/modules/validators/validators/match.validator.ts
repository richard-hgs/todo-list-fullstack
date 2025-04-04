import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";


@ValidatorConstraint({name: 'Match'})
export class MatchValidator implements ValidatorConstraintInterface {
  defaultMessage(args?: ValidationArguments): string {
    return `${args.property} must match ${args.constraints[0]} (${args.property})`;
  }

  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    return value === relatedValue;
  }
}