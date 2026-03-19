import { randomBytes, createHash } from 'crypto';

export function generateApiKey(): { plain: string; hash: string; lastFour: string } {
  const plain = `fa_${randomBytes(24).toString('hex')}`;
  const hash = createHash('sha256').update(plain).digest('hex');
  const lastFour = plain.slice(-4);
  return { plain, hash, lastFour };
}
