import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db/prisma';

export const marketplaceRouter = Router();

const listSchema = z.object({
  q: z.string().optional(),
  categoryId: z.string().optional(),
  tag: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(12),
});

marketplaceRouter.get('/apis', async (req, res) => {
  const parse = listSchema.safeParse(req.query);
  if (!parse.success) {
    return res.status(400).json({ error: 'Invalid query' });
  }

  const { q, categoryId, tag, page, pageSize } = parse.data;
  const skip = (page - 1) * pageSize;

  const where: any = {
    status: 'PUBLISHED',
  };

  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
    ];
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (tag) {
    where.tags = {
      some: {
        tag: { name: tag },
      },
    };
  }

  const [items, total] = await Promise.all([
    prisma.apiListing.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
    }),
    prisma.apiListing.count({ where }),
  ]);

  return res.status(200).json({
    items,
    page,
    pageSize,
    total,
  });
});

marketplaceRouter.get('/apis/:idOrSlug', async (req, res) => {
  const idOrSlug = req.params.idOrSlug;

  const listing = await prisma.apiListing.findFirst({
    where: {
      status: 'PUBLISHED',
      OR: [{ id: idOrSlug }, { slug: idOrSlug }],
    },
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
  });

  if (!listing) {
    return res.status(404).json({ error: 'Listing not found' });
  }

  return res.status(200).json({ listing });
});
