import { createHmac } from 'crypto';

export function signToken(perfilId) {
  return createHmac('sha256', process.env.SESSION_SECRET ?? 'dev-secret-change-in-prod')
    .update(perfilId)
    .digest('hex');
}
