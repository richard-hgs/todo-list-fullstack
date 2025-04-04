import { splitNumChar } from "./regex";


describe("Regex tests", () => {
  describe('splitNumChar', () => {
    it('should correctly split a valid input string into number and character', () => {
      expect(splitNumChar('123h')).toEqual({ num: 123, char: 'h' });
      expect(splitNumChar('5m')).toEqual({ num: 5, char: 'm' });
      expect(splitNumChar('1000d')).toEqual({ num: 1000, char: 'd' });
    });

    it('should throw an error for invalid input strings', () => {
      expect(() => splitNumChar('abc')).toThrowError('Unable to split num char. Invalid input: abc');
      expect(() => splitNumChar('123')).toThrowError('Unable to split num char. Invalid input: 123');
      expect(() => splitNumChar('h')).toThrowError('Unable to split num char. Invalid input: h');
      expect(() => splitNumChar('')).toThrowError('Unable to split num char. Invalid input: ');
    });
  });
})