import { getExpiry, isTokenExpired } from "./date-time";
import moment from 'moment';

// Mock the splitNumChar function (replace with your actual implementation if needed)
jest.mock('./regex', () => {
  const actual = jest.requireActual('./regex');
  return {
    ...actual,
    splitNumChar: jest.fn().mockImplementation((input) => actual.splitNumChar(input))
  }
});

describe("date-time", () => {
  describe('getExpiry', () => {
    it('should calculate the correct expiry date for various durations', () => {
      const now = new Date();

      const testCases = [
        { duration: '1h', expected: moment(now).add(1, 'hour').toDate() },
        { duration: '2d', expected: moment(now).add(2, 'days').toDate() },
        { duration: '3w', expected: moment(now).add(3, 'weeks').toDate() },
        { duration: '4M', expected: moment(now).add(4, 'months').toDate() },
        { duration: '5y', expected: moment(now).add(5, 'years').toDate() },
      ];

      testCases.forEach(({ duration, expected }) => {
        expect(getExpiry(duration)).toBeBetween(expected, moment(expected).add(100, 'millisecond').toDate());
      });
    });
  });

  describe('isTokenExpired', () => {
    it('should return true for expired tokens', () => {
      const pastDate = moment().subtract(1, 'hour').toDate();
      expect(isTokenExpired(pastDate)).toBe(true);
    });

    it('should return false for non-expired tokens', () => {
      const futureDate = moment().add(1, 'hour').toDate();
      expect(isTokenExpired(futureDate)).toBe(false);
    });
  });
});