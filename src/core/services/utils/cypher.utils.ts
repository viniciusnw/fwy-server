import { createCipheriv, createDecipheriv } from 'crypto';

const CRYPTO_SECRET_KEY = process.env.CRYPTO_SECRET_KEY
const algorithm = 'AES-128-ECB';
const encoding = 'utf8';
const output = 'hex';
const iv = null;

export function encrypt(value: any): string {
  const key = Buffer.from(CRYPTO_SECRET_KEY, encoding);
  const cypher = createCipheriv(algorithm, key, iv);
  let encrypted = cypher.update(JSON.stringify(value), encoding, output);
  encrypted += cypher.final(output);
  return encrypted;
}

export function decrypt(encrypted: string): any {
  const key = Buffer.from(CRYPTO_SECRET_KEY, encoding);
  const decypher = createDecipheriv(algorithm, key, iv);
  let decrypted = decypher.update(encrypted, output, encoding);
  decrypted += decypher.final(encoding);
  return JSON.parse(decrypted);
}
