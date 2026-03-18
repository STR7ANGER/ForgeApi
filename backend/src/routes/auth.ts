import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db/prisma';
import { hashPassword, verifyPassword } from '../utils/password';
import { addDuration } from '../utils/time';
import { env } from '../config/env';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { randomUUID } from 'crypto';

export const authRouter = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

async function issueTokens(userId: string) {
  const tokenId = randomUUID();
  const refreshToken = signRefreshToken(userId, tokenId);
  const accessToken = signAccessToken(userId);

  const expiresAt = addDuration(new Date(), env.JWT_REFRESH_EXPIRES_IN);

  await prisma.refreshToken.create({
    data: {
      id: tokenId,
      userId,
      expiresAt,
    },
  });

  return { accessToken, refreshToken };
}

authRouter.post('/register', async (req, res) => {
  const parse = registerSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  const email = parse.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const passwordHash = await hashPassword(parse.data.password);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name: parse.data.name,
    },
    select: { id: true, email: true, name: true },
  });

  const tokens = await issueTokens(user.id);

  return res.status(201).json({ user, ...tokens });
});

authRouter.post('/login', async (req, res) => {
  const parse = loginSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  const email = parse.data.email.toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const ok = await verifyPassword(parse.data.password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const tokens = await issueTokens(user.id);
  return res.status(200).json({
    user: { id: user.id, email: user.email, name: user.name },
    ...tokens,
  });
});

authRouter.post('/refresh', async (req, res) => {
  const parse = refreshSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  try {
    const payload = verifyRefreshToken(parse.data.refreshToken);
    if (payload.type !== 'refresh') {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { id: payload.tokenId },
    });

    if (!tokenRecord || tokenRecord.userId !== payload.sub) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    if (tokenRecord.revokedAt) {
      return res.status(401).json({ error: 'Token revoked' });
    }

    if (tokenRecord.expiresAt.getTime() < Date.now()) {
      return res.status(401).json({ error: 'Token expired' });
    }

    await prisma.refreshToken.update({
      where: { id: tokenRecord.id },
      data: { revokedAt: new Date() },
    });

    const tokens = await issueTokens(payload.sub);
    return res.status(200).json(tokens);
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
});

authRouter.post('/logout', async (req, res) => {
  const parse = refreshSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  try {
    const payload = verifyRefreshToken(parse.data.refreshToken);
    if (payload.type !== 'refresh') {
      return res.status(401).json({ error: 'Invalid token' });
    }

    await prisma.refreshToken.update({
      where: { id: payload.tokenId },
      data: { revokedAt: new Date() },
    });
  } catch {
    return res.status(200).json({ status: 'ok' });
  }

  return res.status(200).json({ status: 'ok' });
});
