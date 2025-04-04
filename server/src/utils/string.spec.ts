import { capitalize, capitalizeWords } from "./string";

describe("String utils tests", () => {
  describe('capitalize', () => {
    it('should capitalize the first letter of a string', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('world')).toBe('World');
      expect(capitalize('javascript')).toBe('Javascript');
    });

    it('should handle an empty string', () => {
      expect(capitalize('')).toBe('');
    });

    it('should not modify the capitalization of other letters', () => {
      expect(capitalize('fOoBaR')).toBe('FOoBaR');
    });

    it('should handle a single-character string', () => {
      expect(capitalize('a')).toBe('A');
    });

    it('should handle a single-character string', () => {
      expect(capitalize('a a')).toBe('A a');
    });
  });

  describe('capitalizeWords', () => {
    it('should capitalize the first letter of each word in a string', () => {
      expect(capitalizeWords('hello world')).toBe('Hello World');
      expect(capitalizeWords('multiple words here')).toBe('Multiple Words Here');
    });

    it('should handle a string with a single word', () => {
      expect(capitalizeWords('word')).toBe('Word');
    });

    it('should handle an empty string', () => {
      expect(capitalizeWords('')).toBe('');
    });

    it('should handle extra spaces correctly', () => {
      expect(capitalizeWords('  with  extra   spaces   ')).toBe('  With  Extra   Spaces   ');
    });

    it('should capitalize words with punctuation', () => {
      expect(capitalizeWords('hello, world!')).toBe('Hello, World!');
      expect(capitalizeWords('this is. a-test.')).toBe('This Is. A-test.');
    });

    it('should handle punctuation at the beginning/end of words', () => {
      expect(capitalizeWords('.hello. world?')).toBe('.Hello. World?');
    });

    it('should handle punctuation-only "words"', () => {
      expect(capitalizeWords('... --- ???')).toBe('... --- ???');
    });
  });
});