jest.mock('react-native-config', () => ({}));

import aesEncryption, { AESEncryption } from '../../../src/redux/utils/AESEncryption';

describe('AESEncryption', () => {
  it('returns empty string for empty plaintext and ciphertext', () => {
    const instance = new AESEncryption();
    expect(instance.aesEncrypt('')).toBe('');
    expect(instance.decryptAnswer('')).toBe('');
  });

  it('encrypts and decrypts roundtrip correctly', () => {
    const instance = new AESEncryption();
    const plain = 'secret-value';
    const encrypted = instance.encryptPassword(plain);

    expect(typeof encrypted).toBe('string');
    expect(encrypted).not.toBe('');
    expect(encrypted).not.toBe(plain);

    const decrypted = instance.decryptAnswer(encrypted);
    expect(decrypted).toBe(plain);
  });

  it('default export can encrypt/decrypt', () => {
    const encrypted = aesEncryption.encryptAnswer('answer-1');
    expect(aesEncryption.decryptAnswer(encrypted)).toBe('answer-1');
  });
});
