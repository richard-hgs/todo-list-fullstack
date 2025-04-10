import { AxiosError } from "axios";

/**
 * Extracts and returns a human-readable error message from an unknown error object.
 *
 * @param {unknown} error - The error object to extract the message from. This can be of any type.
 * @returns {string} A string representing the error message. If the error type is unknown, a default message is returned.
 *
 * @example
 * // Example with an AxiosError
 * const error = new AxiosError("Request failed", { response: { data: { message: "Invalid credentials" } } });
 * console.log(getErrorMessage(error)); // Output: "Invalid credentials"
 *
 * @example
 * // Example with a standard Error
 * const error = new Error("Something went wrong");
 * console.log(getErrorMessage(error)); // Output: "Something went wrong"
 *
 * @example
 * // Example with a string error
 * const error = "An error occurred";
 * console.log(getErrorMessage(error)); // Output: "An error occurred"
 *
 * @example
 * // Example with an unknown error type
 * const error = 42;
 * console.log(getErrorMessage(error)); // Output: "Erro desconhecido"
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    return error?.response?.data?.message ?? error?.message;
  } else if (error instanceof Error) {
    return error?.message;
  } else if (typeof error === "string") {
    return error;
  } else {
    return "Erro desconhecido";
  }
}
