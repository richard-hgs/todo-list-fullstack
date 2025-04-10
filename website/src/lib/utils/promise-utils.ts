/**
 * Pauses the execution of an asynchronous function for a specified duration.
 *
 * @param {number} millis - The number of milliseconds to pause execution.
 * @returns {Promise<void>} A promise that resolves after the specified duration.
 *
 * @example
 * // Usage in an async function
 * async function example() {
 *   console.log("Start");
 *   await sleep(1000); // Pauses for 1 second
 *   console.log("End");
 * }
 */
async function sleep(millis: number) {
  return new Promise<void>((resolve) => setTimeout(() => resolve(), millis));
}
