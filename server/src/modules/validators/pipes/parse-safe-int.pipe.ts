import { BadRequestException, ParseIntPipe, ParseIntPipeOptions } from "@nestjs/common";
import { capitalize } from "../../../utils/string";
import { ArgumentMetadata } from "@nestjs/common/interfaces/features/pipe-transform.interface";

/**
 * Extends the built-in `ParseIntPipe` to provide more informative error messages
 * and safely parse integers within the safe integer range.
 */
export class ParseSafeIntPipe extends ParseIntPipe {

  protected value: string;

  /**
   * Custom exception factory function that generates a `BadRequestException` with
   * a detailed error message including the property type, property name, and the
   * invalid value.
   */
  protected exceptionFactory: (error: string) => any = (error) => {
    let strPropType = "";
    if (this.propType) {
      strPropType = ` ${capitalize(this.propType)}`;
    }

    let strPropName = "";
    if (this.propName) {
      strPropName = ` ${this.propName}`
    }

    let strValue = ` (${this.value})`;

    return new BadRequestException(`${error}.${strPropType}${strPropName}${strValue}`);
  };

  /**
   * Creates an instance of `ParseSafeIntPipe`.
   *
   * @param propType - Optional string indicating the type of the property (e.g., 'query', 'param').
   * @param propName - Optional string representing the name of the property being validated.
   * @param options - Optional configuration options inherited from `ParseIntPipe`.
   */
  constructor(private readonly propType?: string, private readonly propName?: string, options?: ParseIntPipeOptions) {
    super(options);
  }

  /**
   * Checks if a value is numeric and within the safe integer range.
   *
   * @param value - The string value to check.
   * @returns `true` if the value is numeric and within the safe range, otherwise `false`.
   */
  protected isNumeric(value: string): boolean {
    const parsedNum = Number(value);
    this.value = value;
    return parsedNum >= Number.MIN_SAFE_INTEGER
      && parsedNum <= Number.MAX_SAFE_INTEGER
      && super.isNumeric(value);
  }

  /**
   * Method that accesses and performs optional transformation on argument for
   * in-flight requests sync
   *
   * @param value currently processed route argument
   * @param metadata contains metadata about the currently processed route argument
   */
  transformSync(value: string, metadata: ArgumentMetadata): number {
    if (value == null && this.options?.optional) {
      return value as unknown as number;
    }
    if (!this.isNumeric(value)) {
      throw this.exceptionFactory('Validation failed (numeric string is expected)');
    }
    return parseInt(value, 10);
  }
}