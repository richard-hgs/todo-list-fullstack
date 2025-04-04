/**
 * A readonly array containing the supported language codes.
 * Using `as const` ensures that both the array and its elements are treated as constants.
 */
export const _AcceptedLanguages = ["en-US", "pt-BR"] as const;

/**
 * Represents the accepted language codes for localization.
 * This type is dynamically derived from the `Languages` array, ensuring type safety.
 */
export type AcceptedLanguages = typeof _AcceptedLanguages[number];

/**
 * Checks if a given language code is accepted.
 *
 * @param lang - The language code to check (e.g., "en-US").
 * @returns True if the language code is accepted, otherwise false.
 *           The `lang is AcceptedLanguages` type predicate helps TypeScript
 *           narrow the type within conditional statements.
 */
export function isAcceptedLanguage(lang: string): lang is AcceptedLanguages {
  // Asserting 'lang' as AcceptedLanguages here helps TypeScript with type inference inside `includes`.
  return _AcceptedLanguages.includes(<AcceptedLanguages> lang);
}