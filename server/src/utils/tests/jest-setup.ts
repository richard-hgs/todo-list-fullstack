// noinspection JSUnusedGlobalSymbols

import { expect } from '@jest/globals';
// import { toBePretty } from "./matchers/to-be-pretty.matcher";
import * as extendedMatchers from "jest-extended";

expect.extend({
  ...extendedMatchers,
  // toBePretty
});

declare global {
  namespace jest {
    interface AsymmetricMatchers {
      // toBePretty(expected: unknown, expectedPretty: unknown, actualPretty: unknown|unknown[]): void;
    }
    interface Matchers<R> {
      // toBePretty(expected: unknown, expectedPretty: unknown, actualPretty: unknown|unknown[]): R;
    }
  }
}
