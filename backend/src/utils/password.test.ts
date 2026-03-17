import { describe, expect, it } from 'vitest';
import { hashPassword, verifyPassword } from './password';

describe('password utils', () => {
  it('hashes and verifies valid passwords', async () => {
    const hash = await hashPassword('correct-horse-battery-staple');
    const ok = await verifyPassword('correct-horse-battery-staple', hash);
    expect(ok).toBe(true);
  });

  it('rejects invalid passwords', async () => {
    const hash = await hashPassword('correct-horse-battery-staple');
    const ok = await verifyPassword('wrong-password', hash);
    expect(ok).toBe(false);
  });
});
