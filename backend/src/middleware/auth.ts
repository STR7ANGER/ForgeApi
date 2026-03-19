import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { prisma } from '../db/prisma';

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing access token' });
  }

  const token = header.replace('Bearer ', '').trim();
  try {
    const payload = verifyAccessToken(token);
    if (payload.type !== 'access') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.user = { id: payload.sub };
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export function requireOrgRole(allowed: Array<'OWNER' | 'ADMIN' | 'MEMBER'>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const orgId = req.header('x-org-id');
    if (!orgId) {
      return res.status(400).json({ error: 'Missing x-org-id header' });
    }

    const membership = await prisma.orgMember.findUnique({
      where: { userId_orgId: { userId: req.user.id, orgId } },
      select: { role: true },
    });

    if (!membership || !allowed.includes(membership.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    req.orgId = orgId;
    return next();
  };
}
