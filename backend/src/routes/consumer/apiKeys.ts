import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../db/prisma';
import { requireAuth } from '../../middleware/auth';
import { generateApiKey } from '../../utils/apiKey';

export const consumerApiKeysRouter = Router();

const createSchema = z.object({
  listingId: z.string().min(1),
  name: z.string().min(1).optional(),
});

consumerApiKeysRouter.post('/api-keys', requireAuth, async (req, res) => {
  const parse = createSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  const userId = req.user!.id;
  const listingId = parse.data.listingId;

  const subscription = await prisma.subscription.findUnique({
    where: { userId_listingId: { userId, listingId } },
  });

  if (!subscription || subscription.status !== 'ACTIVE') {
    return res.status(403).json({ error: 'Active subscription required' });
  }

  let keyData = generateApiKey();
  let attempts = 0;
  let created = null;

  while (!created && attempts < 3) {
    attempts += 1;
    try {
      created = await prisma.apiKey.create({
        data: {
          userId,
          listingId,
          name: parse.data.name,
          keyHash: keyData.hash,
          lastFour: keyData.lastFour,
        },
      });
    } catch {
      keyData = generateApiKey();
    }
  }

  if (!created) {
    return res.status(500).json({ error: 'Failed to issue key' });
  }

  return res.status(201).json({
    apiKey: {
      id: created.id,
      name: created.name,
      lastFour: created.lastFour,
      createdAt: created.createdAt,
    },
    secret: keyData.plain,
  });
});

consumerApiKeysRouter.delete('/api-keys/:id', requireAuth, async (req, res) => {
  const userId = req.user!.id;
  const keyId = req.params.id;

  const existing = await prisma.apiKey.findFirst({
    where: { id: keyId, userId },
  });

  if (!existing) {
    return res.status(404).json({ error: 'API key not found' });
  }

  if (existing.revokedAt) {
    return res.status(200).json({ apiKey: existing });
  }

  const apiKey = await prisma.apiKey.update({
    where: { id: existing.id },
    data: { revokedAt: new Date() },
  });

  return res.status(200).json({
    apiKey: {
      id: apiKey.id,
      name: apiKey.name,
      lastFour: apiKey.lastFour,
      revokedAt: apiKey.revokedAt,
    },
  });
});
