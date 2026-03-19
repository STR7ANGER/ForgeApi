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

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  description: z.string().min(1).optional().nullable(),
  categoryId: z.string().min(1).optional().nullable(),
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

sellerApisRouter.patch('/:id', requireAuth, requireOrgRole(['OWNER', 'ADMIN']), async (req, res) => {
  const parse = updateSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  const orgId = req.orgId as string;
  const listingId = req.params.id;

  const existing = await prisma.apiListing.findFirst({
    where: { id: listingId, orgId },
    include: { tags: { include: { tag: true } } },
  });

  if (!existing) {
    return res.status(404).json({ error: 'Listing not found' });
  }

  let slug: string | undefined;
  if (parse.data.slug) {
    slug = slugify(parse.data.slug);
  } else if (parse.data.name) {
    slug = slugify(parse.data.name);
  }

  if (slug && slug !== existing.slug) {
    const slugInUse = await prisma.apiListing.findUnique({ where: { slug } });
    if (slugInUse) {
      return res.status(409).json({ error: 'Slug already in use' });
    }
  }

  if (parse.data.categoryId !== undefined && parse.data.categoryId !== null) {
    const category = await prisma.category.findUnique({ where: { id: parse.data.categoryId } });
    if (!category) {
      return res.status(400).json({ error: 'Invalid categoryId' });
    }
  }

  const updates: {
    name?: string;
    slug?: string;
    description?: string | null;
    categoryId?: string | null;
  } = {};

  if (parse.data.name !== undefined) updates.name = parse.data.name;
  if (slug) updates.slug = slug;
  if (parse.data.description !== undefined) updates.description = parse.data.description;
  if (parse.data.categoryId !== undefined) updates.categoryId = parse.data.categoryId;

  const uniqueTags = parse.data.tags
    ? Array.from(new Set(parse.data.tags.map((t) => t.trim()).filter(Boolean)))
    : undefined;

  const listing = await prisma.apiListing.update({
    where: { id: existing.id },
    data: {
      ...updates,
      tags: uniqueTags
        ? {
            deleteMany: {},
            create: uniqueTags.map((name) => ({
              tag: {
                connectOrCreate: {
                  where: { name },
                  create: { name },
                },
              },
            })),
          }
        : undefined,
    },
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
  });

  return res.status(200).json({ listing });
});
