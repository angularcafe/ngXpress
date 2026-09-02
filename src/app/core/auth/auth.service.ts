import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import {
  PLATFORM_ID,
  REQUEST,
  Service,
  TransferState,
  computed,
  inject,
  makeStateKey,
  signal,
} from '@angular/core';
import { authClient } from './auth-client';

export type AuthSession = Awaited<ReturnType<typeof authClient.getSession>>['data'];

const AUTH_SESSION_STATE_KEY = makeStateKey<AuthSession | null>('auth.session');

@Service()
export class AuthService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly request = inject(REQUEST, { optional: true });
  private readonly transferState = inject(TransferState);

  readonly session = signal<AuthSession | null>(null);
  readonly isPending = signal(true);
  readonly isAuthenticated = computed(() => !!this.session());

  async init(): Promise<void> {
    if (isPlatformServer(this.platformId) && this.request) {
      try {
        const sessionUrl = new URL('/api/auth/get-session', this.request.url);
        const response = await fetch(sessionUrl, {
          headers: this.request.headers,
        });
        const session: AuthSession = response.ok ? await response.json() : null;
        this.session.set(session);
        this.transferState.set(AUTH_SESSION_STATE_KEY, session);
      } catch {
        this.session.set(null);
        this.transferState.set(AUTH_SESSION_STATE_KEY, null);
      }
    }

    if (isPlatformBrowser(this.platformId)) {
      if (this.transferState.hasKey(AUTH_SESSION_STATE_KEY)) {
        const initialSession = this.transferState.get(AUTH_SESSION_STATE_KEY, null);
        authClient.hydrateSession(initialSession);
        this.transferState.remove(AUTH_SESSION_STATE_KEY);
      }

      const { data } = await authClient.getSession();
      this.session.set(data);
    }

    this.isPending.set(false);
  }

  async signIn(email: string, password: string) {
    const result = await authClient.signIn.email({ email, password });
    if (!result.error) {
      const { data } = await authClient.getSession();
      this.session.set(data);
    }
    return result;
  }

  async signUp(name: string, email: string, password: string) {
    const result = await authClient.signUp.email({ name, email, password });
    if (!result.error) {
      const { data } = await authClient.getSession();
      this.session.set(data);
    }
    return result;
  }

  async signOut() {
    const result = await authClient.signOut();
    this.session.set(null);
    return result;
  }

  async requestPasswordReset(email: string) {
    return authClient.requestPasswordReset({
      email,
      redirectTo: '/auth/reset-password',
    });
  }

  async resetPassword(token: string, newPassword: string) {
    return authClient.resetPassword({ token, newPassword });
  }
}
