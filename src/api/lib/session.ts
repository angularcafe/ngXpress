import type { Request } from 'express';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from './auth';

export async function requireSession(req: Request) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    return null;
  }

  return session;
}
