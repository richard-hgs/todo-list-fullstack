// import { MatcherFunction } from "expect";
//
// export const toBePretty: MatcherFunction<[expected: unknown, expectedPretty: unknown, actualPretty: unknown|unknown[]]> = function (actual, expected, expectedPretty, actualPretty) {
//   const pass = Object.is(actual, expected);
//   if (pass) {
//     return {
//       message: () => `Passed`, // Optional success message
//       pass: true,
//     };
//   } else {
//     return {
//       message: () =>
//       `Error: expect(${this.utils.printReceived(
//         expectedPretty,
//       )}).toBe(${this.utils.printExpected(
//         actualPretty,
//       )})\n` + `Error: expect(${this.utils.printReceived(
//           actual,
//         )}).toBe(${this.utils.printExpected(
//           expected,
//         )})`,
//       pass: false,
//     };
//   }
// }