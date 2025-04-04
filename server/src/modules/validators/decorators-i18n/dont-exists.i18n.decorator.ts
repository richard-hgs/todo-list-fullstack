import { ValidationOptions } from "class-validator/types/decorator/ValidationOptions";
import { i18nValidationMessage } from "nestjs-i18n";
import { I18nTranslations } from "../../../generated/i18n.generated";
import { DontExists } from "../decorators/dont-exists.decorator";
import { DbSchemaType } from "../../database/model/db-schema-type";

/**
 * A custom decorator that extends the built-in `@DontExists` validator.
 * It automatically sets the validation error message using the `i18nValidationMessage`
 * function to provide internationalized error messages.
 *
 * @param tblName - Required table name where the property value existence will be searched for.
 * @param dbSchemaType - The database schema type where the value will be checked for existence
 * @param validationOptions - Optional validation options to pass to the underlying `@DontExists` decorator.
 * @returns A property decorator function.
 */
export function DontExistsI18n(tblName: string, dbSchemaType: DbSchemaType = DbSchemaType.BASE, validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    const optionsWithMessage: ValidationOptions = {
      message: i18nValidationMessage<I18nTranslations>('validation.dont_exists'),
      ...validationOptions,
    };
    DontExists(tblName, dbSchemaType, optionsWithMessage)(object, propertyName);
  };
}