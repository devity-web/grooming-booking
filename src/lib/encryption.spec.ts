import {randomBytes} from 'node:crypto';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

vi.mock('server-only', () => ({}));

import {decrypt, encrypt} from './encryption';

const originalKey = process.env.TOKEN_ENCRYPTION_KEY;

describe('token encryption', () => {
  beforeEach(() => {
    process.env.TOKEN_ENCRYPTION_KEY = randomBytes(32).toString('base64');
  });

  afterEach(() => {
    if (originalKey === undefined) {
      delete process.env.TOKEN_ENCRYPTION_KEY;
    } else {
      process.env.TOKEN_ENCRYPTION_KEY = originalKey;
    }
  });

  it('round-trips a value', () => {
    const token = 'google-refresh-token-ç';

    expect(decrypt(encrypt(token))).toBe(token);
  });

  it('uses a new IV for each encrypted value', () => {
    expect(encrypt('same-token')).not.toBe(encrypt('same-token'));
  });

  it('rejects a tampered value', () => {
    const encrypted = encrypt('secret');
    const tampered = `${encrypted.slice(0, -1)}${encrypted.endsWith('A') ? 'B' : 'A'}`;

    expect(() => decrypt(tampered)).toThrow('Unable to decrypt value');
  });

  it('requires a valid key', () => {
    process.env.TOKEN_ENCRYPTION_KEY = 'not-a-32-byte-base64-key';

    expect(() => encrypt('secret')).toThrow(
      'TOKEN_ENCRYPTION_KEY must be a base64-encoded 32-byte key',
    );
  });
});
