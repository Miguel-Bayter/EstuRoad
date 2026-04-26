import { timingSafeEqual } from 'crypto';
import { signToken } from '../utils/sessionToken.js';

export function authenticate(req, res, next) {
  const token = req.cookies?.session;
  if (!token) {
    return res.status(401).json({ success: false, error: 'No autenticado' });
  }

  const expected = signToken(req.params.id);

  let tokenBuf, expectedBuf;
  try {
    tokenBuf = Buffer.from(token, 'hex');
    expectedBuf = Buffer.from(expected, 'hex');
  } catch {
    return res.status(403).json({ success: false, error: 'Acceso denegado' });
  }

  if (tokenBuf.length !== expectedBuf.length) {
    return res.status(403).json({ success: false, error: 'Acceso denegado' });
  }

  if (!timingSafeEqual(tokenBuf, expectedBuf)) {
    return res.status(403).json({ success: false, error: 'Acceso denegado' });
  }

  next();
}
