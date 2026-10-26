import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import { env } from '../config/env.js';

declare global { namespace Express { interface Request { ownerId: string } } }
const cookieName = 'mystery_session';
function sign(id: string) { return createHmac('sha256', env.SESSION_SECRET).update(id).digest('hex'); }
export function sessionMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.[cookieName] as string | undefined;
  if (token) {
    const [id, signature] = token.split('.');
    if (id && signature) {
      const expected = Buffer.from(sign(id)); const actual = Buffer.from(signature);
      if (actual.length === expected.length && timingSafeEqual(actual, expected)) { req.ownerId = id; return next(); }
    }
  }
  const id = randomUUID(); req.ownerId = id;
  res.cookie(cookieName, `${id}.${sign(id)}`, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 1000 * 60 * 60 * 24 * 365, path: '/' });
  next();
}
