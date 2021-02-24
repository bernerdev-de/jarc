import * as crypto from 'crypto';

export function hash(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const key = crypto
    .scryptSync(`${process.env.PASSWORD_PEPPER}${password}`, salt, 64)
    .toString('hex');
  return `${key}:${salt}`;
}

export function verify(password: string, hash: string): boolean {
  const [hashKey, salt] = hash.split(':');
  const pwdKey = crypto
    .scryptSync(`${process.env.PASSWORD_PEPPER}${password}`, salt, 64)
    .toString('hex');
  return hashKey === pwdKey;
}

export default { hash, verify };
