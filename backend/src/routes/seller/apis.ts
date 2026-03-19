import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../db/prisma';
import { requireAuth, requireOrgRole } from '../../middleware/auth';
import { slugify } from '../../utils/slug';

export const sellerApisRouter = Router();

const createSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).optional(),
  description: z.string().min(1).optional(),
  categoryId: z.string().min(1).optional(),
  tags: z.array(z.string().min(1)).optional(),
});

sellerApisRouter.post('/', requireAuth, requireOrgRole(['OWNER', 'ADMIN']), async (req, res) => {
  const parse = createSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  const orgId = req.orgId as string;
  const input = parse.data;
  const slug = input.slug ? slugify(input.slug) : slugify(input.name);

  const existing = await prisma.apiListing.findUnique({ where: { slug } });
  if (existing) {
    return res.status(409).json({ error: 'Slug already in use' });
  }

  if (input.categoryId) {
    const category = await prisma.category.findUnique({ where: { id: input.categoryId } });
    if (!category) {
      return res.status(400).json({ error: 'Invalid categoryId' });
    }
  }

  const uniqueTags = Array.from(new Set((input.tags ?? []).map((t) => t.trim()).filter(Boolean)));

  const listing = await prisma.apiListing.create({
    data: {
      orgId,
      name: input.name,
      slug,
      description: input.description,
      categoryId: input.categoryId,
      tags: {
        create: uniqueTags.map((name) => ({
          tag: {
            connectOrCreate: {
              where: { name },
              create: { name },
            },
          },
        })),
      },
    },
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
  });

  return res.status(201).json({ listing });
});
