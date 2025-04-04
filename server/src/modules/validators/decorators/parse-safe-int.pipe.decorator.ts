import { Transform } from "class-transformer";
import { ParseSafeIntPipe } from "../pipes/parse-safe-int.pipe";
import { ParseIntPipeOptions } from "@nestjs/common";
import { ArgumentMetadata } from "@nestjs/common/interfaces/features/pipe-transform.interface";

/**
 * Decorator that transforms a route parameter or query parameter into a number.
 * It uses the `ParseSafeIntPipe` internally to perform the transformation and validation.
 *
 * @param {ArgumentMetadata["type"]} [type='query'] - The type of parameter ('query', 'param', 'body', etc.). Defaults to 'query'.
 * @param {ParseIntPipeOptions} [options] - Optional configuration options for the `ParseIntPipe`.
 *
 * @example
 * ```typescript
 * class MyDto {
 *   @ParseSafeInt() // Transforms a query parameter named 'id' to a number.
 *   id: number;
 *
 *   @ParseSafeInt('param') // Transforms a route parameter named 'userId' to a number.
 *   userId: number;
 * }
 * ```
 */
export function ParseSafeInt(type: ArgumentMetadata["type"] = "query", options?: ParseIntPipeOptions) {
  return function (object: any, propertyName: string) {
    Transform(({value}) => {
      const safeIntPipe = new ParseSafeIntPipe(typeof value, propertyName, options);
      return safeIntPipe.transformSync(value, { type: type })
    })(object, propertyName);
  }
}