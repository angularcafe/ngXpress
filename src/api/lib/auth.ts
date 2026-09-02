import { betterAuth } from 'better-auth/minimal';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { getTrustedOrigins } from './trusted-origins';
import { sendDevEmail } from './email';
import { prisma } from './prisma';

export const auth = betterAuth({
  baseURL: process.env['BETTER_AUTH_URL'],
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      void sendDevEmail({
        to: user.email,
        subject: 'Reset your password',
        text: `Click the link to reset your password: ${url}`,
      });
    },
    onPasswordReset: async ({ user }) => {
      console.info(`[auth] Password reset for ${user.email}`);
    },
  },
  trustedOrigins: getTrustedOrigins(),
});
