import { ConfigService } from './config.service';

describe('ConfigService', () => {
  let configService: ConfigService;

  beforeEach(() => {
    configService = new ConfigService();
  });

  describe('getEnv', () => {
    it('should return the environment variable value for a given key', () => {
      process.env.TEST_ENV_VAR = 'test value';
      expect(configService.getEnv('TEST_ENV_VAR')).toBe('test value');
      delete process.env.TEST_ENV_VAR; // Clean up
    });

    it('should return undefined if the environment variable is not set', () => {
      expect(configService.getEnv('NON_EXISTENT_VAR')).toBeUndefined();
    });
  });

  describe('getApiEntryPoint', () => {
    it('should return the API entry point with https for production', () => {
      process.env.NODE_ENV = 'production';
      process.env.HOST = 'api.example.com';
      process.env.PORT = '443';
      expect(configService.getApiEntryPoint()).toBe('https://api.example.com:443');
      delete process.env.NODE_ENV;
      delete process.env.HOST;
      delete process.env.PORT;
    });

    it('should return the API entry point with http for non-production', () => {
      process.env.NODE_ENV = 'development';
      process.env.HOST = 'localhost';
      process.env.PORT = '3000';
      expect(configService.getApiEntryPoint()).toBe('http://localhost:3000');
      delete process.env.NODE_ENV;
      delete process.env.HOST;
      delete process.env.PORT;
    });

    it('should use default values for host and port if not set', () => {
      process.env.NODE_ENV = 'test'; // Any non-production value
      expect(configService.getApiEntryPoint()).toBe('http://localhost:3000');
      delete process.env.NODE_ENV;
    });
  });
});