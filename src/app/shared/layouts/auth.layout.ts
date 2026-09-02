import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { APP_NAME, APP_TAGLINE } from '@core/config/app-brand';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterLink, RouterOutlet],
  template: `
    <div class="grid min-h-svh lg:grid-cols-2">
      <div
        class="bg-muted text-muted-foreground relative hidden flex-col justify-between p-10 lg:flex"
      >
        <a routerLink="/" class="text-foreground text-lg font-semibold tracking-tight">
          {{ appName }}
        </a>

        <div class="space-y-4">
          <blockquote class="text-foreground text-lg leading-relaxed font-medium">
            &ldquo;{{ appTagline }}&rdquo;
          </blockquote>
          <p class="text-sm">Join thousands of teams shipping work with clarity.</p>
        </div>

        <p class="text-sm">Your data is encrypted and secure.</p>
      </div>

      <div class="flex flex-col justify-center gap-6 p-6 md:p-10">
        <a routerLink="/" class="text-foreground text-lg font-semibold tracking-tight lg:hidden">
          {{ appName }}
        </a>
        <router-outlet />
      </div>
    </div>
  `,
})
export class AuthLayout {
  protected readonly appName = APP_NAME;
  protected readonly appTagline = APP_TAGLINE;
}
