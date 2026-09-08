import { afterEach, describe, expect, it } from 'vitest';
import { getTrustedOrigins } from './trusted-origins';

describe('getTrustedOrigins', () => {
  const originalEnv = process.env['BETTER_AUTH_TRUSTED_ORIGINS'];

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env['BETTER_AUTH_TRUSTED_ORIGINS'];
    } else {
      process.env['BETTER_AUTH_TRUSTED_ORIGINS'] = originalEnv;
    }
  });

  it('falls back to the localhost defaults when unset', () => {
    delete process.env['BETTER_AUTH_TRUSTED_ORIGINS'];
    expect(getTrustedOrigins()).toEqual(['http://localhost:4200', 'http://localhost:4000']);
  });

  it('falls back to the localhost defaults when blank', () => {
    process.env['BETTER_AUTH_TRUSTED_ORIGINS'] = '   ';
    expect(getTrustedOrigins()).toEqual(['http://localhost:4200', 'http://localhost:4000']);
  });

  it('parses a comma-separated list from the environment', () => {
    process.env['BETTER_AUTH_TRUSTED_ORIGINS'] = 'https://example.com,https://app.example.com';
    expect(getTrustedOrigins()).toEqual(['https://example.com', 'https://app.example.com']);
  });

  it('trims whitespace and drops empty entries', () => {
    process.env['BETTER_AUTH_TRUSTED_ORIGINS'] =
      ' https://example.com , , https://app.example.com ';
    expect(getTrustedOrigins()).toEqual(['https://example.com', 'https://app.example.com']);
  });
});
