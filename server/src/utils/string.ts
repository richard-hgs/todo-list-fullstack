
/**
 * Capitalizes the first letter of a string.
 *
 * @param s - The string to capitalize.
 * @returns The capitalized string.
 */
export function capitalize(s: string): string {
  return s && s[0].toUpperCase() + s.slice(1)
}

/**
 * Capitalizes the first letter of each word in a string.
 * It considers words as groups of characters separated by spaces
 * and handles punctuation at the beginning of words.
 *
 * @param str - The string to capitalize.
 * @returns The capitalized string.
 */
export function capitalizeWords(str: string): string {
  return str.replace(/(^[.,\-_]*\w)|(\s+\w)/g, letter => letter.toUpperCase());
}