import 'server-only';

import {createCipheriv, createDecipheriv, randomBytes} from 'node:crypto';
import {getServerEnv} from './env';

const ALGORITHM = 'aes-256-gcm';
const FORMAT_VERSION = 'v1';
const IV_LENGTH = 12;

const env = getServerEnv();

function getEncryptionKey() {
  const encodedKey = env.TOKEN_ENCRYPTION_KEY;

  if (!encodedKey) {
    throw new Error('TOKEN_ENCRYPTION_KEY is not configured');
  }

  const key = Buffer.from(encodedKey, 'base64');

  if (key.length !== 32 || key.toString('base64') !== encodedKey) {
    throw new Error(
      'TOKEN_ENCRYPTION_KEY must be a base64-encoded 32-byte key',
    );
  }

  return key;
}

/**
 * Encrypts a secret using AES-256-GCM.
 *
 * The returned value includes the format version, IV, authentication tag, and
 * ciphertext. A new IV is generated for every call, so encrypting the same
 * value twice intentionally produces different results.
 */
export function encrypt(value: string) {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, getEncryptionKey(), iv);
  cipher.setAAD(Buffer.from(FORMAT_VERSION));

  const ciphertext = Buffer.concat([
    cipher.update(value, 'utf8'),
    cipher.final(),
  ]);
  const authenticationTag = cipher.getAuthTag();

  return [
    FORMAT_VERSION,
    iv.toString('base64url'),
    authenticationTag.toString('base64url'),
    ciphertext.toString('base64url'),
  ].join('.');
}

export function decrypt(encryptedValue: string) {
  const [version, encodedIv, encodedTag, encodedCiphertext, ...extraParts] =
    encryptedValue.split('.');

  if (
    version !== FORMAT_VERSION ||
    !encodedIv ||
    !encodedTag ||
    !encodedCiphertext ||
    extraParts.length > 0
  ) {
    throw new Error('Invalid encrypted value');
  }

  try {
    const iv = Buffer.from(encodedIv, 'base64url');
    const authenticationTag = Buffer.from(encodedTag, 'base64url');
    const ciphertext = Buffer.from(encodedCiphertext, 'base64url');

    if (iv.length !== IV_LENGTH || authenticationTag.length !== 16) {
      throw new Error('Invalid encrypted value');
    }

    const decipher = createDecipheriv(ALGORITHM, getEncryptionKey(), iv);
    decipher.setAAD(Buffer.from(FORMAT_VERSION));
    decipher.setAuthTag(authenticationTag);

    return Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ]).toString('utf8');
  } catch {
    throw new Error('Unable to decrypt value');
  }
}
