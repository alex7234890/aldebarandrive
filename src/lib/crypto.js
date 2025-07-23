import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // AES-GCM richiede 12 byte di IV
const KEY_ENV = process.env.SECRET_KEY; // Assicurati di usare lo stesso nome in tutto il progetto

if (!KEY_ENV) {
  throw new Error('SECRET_KEY non è definita nelle variabili di ambiente.');
}

const KEY = Buffer.from(KEY_ENV, 'base64');

if (KEY.length !== 32) {
  throw new Error('SECRET_KEY deve essere lunga 32 byte (codificata in base64).');
}

export function encrypt(text) {
  if (text === null || text === undefined) return null;
  if (typeof text !== 'string') text = String(text);

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  return Buffer.concat([iv, tag, encrypted]).toString('base64');
}

export function decrypt(encrypted) {
  if (!encrypted) return null;

  const data = Buffer.from(encrypted, 'base64');
  const iv = data.slice(0, IV_LENGTH);
  const tag = data.slice(IV_LENGTH, IV_LENGTH + 16);
  const text = data.slice(IV_LENGTH + 16);

  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([decipher.update(text), decipher.final()]);
  return decrypted.toString('utf8');
}
