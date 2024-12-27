import { googleClient } from '../google';

describe('Google Client', () => {
  const mockEnv = {
    GOOGLE_CLIENT_EMAIL: 'test@example.com',
    GOOGLE_PRIVATE_KEY: 'test-key',
    GOOGLE_PROJECT_ID: 'test-project',
  };

  beforeEach(() => {
    process.env = { ...mockEnv };
  });

  it('should initialize with environment variables', () => {
    expect(googleClient).toBeDefined();
    expect(googleClient.config.projectId).toBe(mockEnv.GOOGLE_PROJECT_ID);
  });

  it('should throw error without required environment variables', () => {
    process.env = {};
    expect(() => {
      require('../google');
    }).toThrow();
  });
});
