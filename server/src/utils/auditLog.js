export function auditLog(action, perfilId, req) {
  const entry = {
    timestamp: new Date().toISOString(),
    action,
    perfilId,
    ip: req.ip ?? req.socket?.remoteAddress ?? 'unknown',
    userAgent: req.headers['user-agent'] ?? 'unknown',
  };
  console.log('[AUDIT]', JSON.stringify(entry));
}
