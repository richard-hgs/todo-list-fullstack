import { generateOTP, generateUUID } from "./code-generator";

describe("Code generator tests", () => {
  describe('generateOTP', () => {
    it('should generate an OTP of the specified length', () => {
      const otpLength = 6;
      const otp = generateOTP(otpLength);
      expect(otp.length).toBe(otpLength);
    });

    it('should generate an OTP containing only digits', () => {
      const otp = generateOTP(4);
      const isDigit = (char: string) => /^\d$/.test(char); // Regex to check for digits
      expect(otp.split('').every(isDigit)).toBe(true);
    });

    it('should generate different OTPs on subsequent calls', () => {
      const otp1 = generateOTP(6);
      const otp2 = generateOTP(6);
      expect(otp1).not.toBe(otp2);
    });
  });

  describe('generateUUID', () => {
    it('should generate a UUID string with the correct format', () => {
      const uuid = generateUUID();
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    });

    it('should generate different UUIDs on subsequent calls', () => {
      const uuid1 = generateUUID();
      const uuid2 = generateUUID();
      expect(uuid1).not.toBe(uuid2);
    });
  });
});