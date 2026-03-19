import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db/prisma';
import { createHash } from 'crypto';

export const usageRouter = Router();

const usageSchema = z.object({
  listingId: z.string().min(1),
  apiKey: z.string().min(1).optional(),
  statusCode: z.number().int().min(100).max(599),
  latencyMs: z.number().int().min(0),
  path: z.string().min(1),
  method: z.string().min(1),
});

usageRouter.post('/log', async (req, res) => {
  const parse = usageSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  const data = parse.data;
  let apiKeyId: string | undefined;

  if (data.apiKey) {
    const hash = createHash('sha256').update(data.apiKey).digest('hex');
    const key = await prisma.apiKey.findUnique({ where: { keyHash: hash } });
    if (key && !key.revokedAt) {
      apiKeyId = key.id;
    }
  }

  const listing = await prisma.apiListing.findUnique({ where: { id: data.listingId } });
  if (!listing) {
    return res.status(404).json({ error: 'Listing not found' });
  }

  const log = await prisma.usageLog.create({
    data: {
      listingId: data.listingId,
      apiKeyId,
      statusCode: data.statusCode,
      latencyMs: data.latencyMs,
      path: data.path,
      method: data.method,
      ipAddress: req.ip,
      userAgent: req.get('user-agent') ?? undefined,
    },
  });

  return res.status(201).json({ logId: log.id });
});
