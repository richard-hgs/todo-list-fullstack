import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { PrismaBaseService } from "../../prisma/prisma-base.service";
import { capitalize } from "../../../utils/string";
import { DbSchemaType } from "../../database/model/db-schema-type";

/**
 * Custom validator constraint to check if a value does not already exist in the database.
 */
@ValidatorConstraint({ name: 'DontExists', async: true })
@Injectable()
export class DontExistsValidator implements ValidatorConstraintInterface {
  constructor(
    private readonly prismaService: PrismaBaseService
  ) {}

  /**
   * Provides a default error message when the validation fails.
   *
   * @param validationArguments - Contains information about the validation context.
   * @returns A string representing the default error message.
   */
  defaultMessage(validationArguments?: ValidationArguments): string {
    const tblName = validationArguments.constraints[0].tblName;
    return `${capitalize(tblName)} ${validationArguments.property} already exists`;
  }

  /**
   * Performs the asynchronous validation logic.
   *
   * @param value - The value being validated.
   * @param validationArguments - Contains information about the validation context.
   * @returns A promise resolving to true if the validation passes, false otherwise.
   */
  async validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> {
    // Extract the table name from the validation constraints
    const constraints = validationArguments.constraints[0] as {
      tblName: string,
      dbSchemaType: DbSchemaType
    };

    const tblName = constraints.tblName;
    const dbSchemaType = constraints.dbSchemaType;

    const dbEntity = this.prismaService[tblName as any] as unknown as {
      findUnique: (where: { where: {[key:string]: unknown}}) => unknown
    };

    // If the value is undefined, consider it invalid
    if (value === undefined) {
      return false;
    }

    return !(await dbEntity.findUnique({ where: { [validationArguments.property]: value }}));
  }
}