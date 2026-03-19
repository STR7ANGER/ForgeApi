import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../db/prisma';
import { requireAuth } from '../../middleware/auth';

export const consumerSubscriptionsRouter = Router();

const subscribeSchema = z.object({
  listingId: z.string().min(1),
});

consumerSubscriptionsRouter.post('/subscribe', requireAuth, async (req, res) => {
  const parse = subscribeSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  const listing = await prisma.apiListing.findUnique({
    where: { id: parse.data.listingId },
  });

  if (!listing || listing.status !== 'PUBLISHED') {
    return res.status(404).json({ error: 'Listing not available' });
  }

  const userId = req.user!.id;

  const existing = await prisma.subscription.findUnique({
    where: { userId_listingId: { userId, listingId: parse.data.listingId } },
  });

  if (existing && existing.status === 'ACTIVE') {
    return res.status(200).json({ subscription: existing });
  }

  const subscription = existing
    ? await prisma.subscription.update({
        where: { id: existing.id },
        data: { status: 'ACTIVE', endedAt: null },
      })
    : await prisma.subscription.create({
        data: {
          userId,
          listingId: parse.data.listingId,
        },
      });

  return res.status(201).json({ subscription });
});

consumerSubscriptionsRouter.post('/unsubscribe', requireAuth, async (req, res) => {
  const parse = subscribeSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  const userId = req.user!.id;
  const listingId = parse.data.listingId;

  const existing = await prisma.subscription.findUnique({
    where: { userId_listingId: { userId, listingId } },
  });

  if (!existing || existing.status === 'CANCELED') {
    return res.status(200).json({ subscription: existing ?? null });
  }

  const subscription = await prisma.subscription.update({
    where: { id: existing.id },
    data: { status: 'CANCELED', endedAt: new Date() },
  });

  return res.status(200).json({ subscription });
});
