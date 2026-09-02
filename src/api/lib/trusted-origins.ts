const DEFAULT_TRUSTED_ORIGINS = ['http://localhost:4200', 'http://localhost:4000'] as const;

export function getTrustedOrigins(): string[] {
  const fromEnv = process.env['BETTER_AUTH_TRUSTED_ORIGINS'];

  if (!fromEnv?.trim()) {
    return [...DEFAULT_TRUSTED_ORIGINS];
  }

  return fromEnv
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}
