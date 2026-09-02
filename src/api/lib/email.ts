export async function sendDevEmail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}): Promise<void> {
  if (process.env['NODE_ENV'] !== 'production') {
    console.info(`[dev-email] to=${to} subject=${subject}\n${text}`);
    return;
  }

  throw new Error('Email provider not configured for production');
}
