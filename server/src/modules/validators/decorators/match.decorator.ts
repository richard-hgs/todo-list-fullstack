import { MatchValidator } from "../validators/match.validator";
import { registerDecorator } from "class-validator";
import { ValidationOptions } from "class-validator/types/decorator/ValidationOptions";


export function Match(property: string, validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'Match',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: MatchValidator,
    });
  };
}