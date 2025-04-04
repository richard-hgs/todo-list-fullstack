import { registerDecorator, ValidationOptions } from "class-validator";
import { DontExistsValidator } from "../validators/dont-exists.validator";
import { DbSchemaType } from "../../database/model/db-schema-type";

/**
 * A custom decorator factory that creates a decorator for checking if a value
 * does not already exist in a specified database table.
 *
 * It uses the `DontExistsValidator` to perform the database lookup.
 *
 * @param tblName - The name of the database table to check for existing values.
 * @param dbSchemaType - The database schema type where the value will be checked for existence
 * @param validationOptions - Optional validation options to pass to the underlying `registerDecorator` function.
 * @returns A property decorator function.
 */
export function DontExists(tblName: string, dbSchemaType: DbSchemaType, validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'DontExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: DontExistsValidator,
      constraints: [
        {
          tblName,
          dbSchemaType
        }
      ]
    });
  };
}