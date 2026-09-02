import { Component, inject, signal } from '@angular/core';
import { email, form, FormField, minLength, required, submit } from '@angular/forms/signals';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { APP_NAME } from '@core/config/app-brand';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';

@Component({
  selector: 'app-login-page',
  imports: [
    RouterLink,
    FormField,
    HlmButtonImports,
    HlmCardImports,
    HlmFieldImports,
    HlmInputImports,
    HlmLabelImports,
  ],
  template: `
    <div class="mx-auto w-full max-w-sm space-y-6">
      <div class="space-y-2 text-center">
        <h1 class="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p class="text-muted-foreground text-sm">Sign in to your {{ appName }} workspace</p>
      </div>

      <div hlmCard>
        <div hlmCardContent class="pt-6">
          <form class="space-y-4" (submit)="onSubmit($event)">
            <hlm-field>
              <label hlmFieldLabel for="login-email">Email</label>
              <input
                hlmInput
                id="login-email"
                type="email"
                autocomplete="email"
                [formField]="loginForm.email"
              />
              <hlm-field-error />
            </hlm-field>

            <hlm-field>
              <label hlmFieldLabel for="login-password">Password</label>
              <input
                hlmInput
                id="login-password"
                type="password"
                autocomplete="current-password"
                [formField]="loginForm.password"
              />
              <hlm-field-error />
            </hlm-field>

            <div class="flex justify-end">
              <a
                routerLink="/auth/forgot-password"
                class="text-primary text-sm font-medium hover:underline"
              >
                Forgot password?
              </a>
            </div>

            <button hlmBtn type="submit" class="w-full" [disabled]="isSubmitting()">
              {{ isSubmitting() ? 'Signing in...' : 'Sign in' }}
            </button>
          </form>
        </div>
      </div>

      <p class="text-muted-foreground text-center text-sm">
        Don&apos;t have an account?
        <a routerLink="/auth/signup" class="text-primary font-medium hover:underline">Sign up</a>
      </p>
    </div>
  `,
})
export class LoginPage {
  protected readonly appName = APP_NAME;
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly isSubmitting = signal(false);

  protected readonly loginModel = signal({
    email: '',
    password: '',
  });

  protected readonly loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.email, { message: 'Email is required' });
    email(schemaPath.email, { message: 'Enter a valid email address' });
    required(schemaPath.password, { message: 'Password is required' });
  });

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.isSubmitting.set(true);

    try {
      await submit(this.loginForm, async () => {
        const { email, password } = this.loginModel();
        const result = await this.auth.signIn(email, password);

        if (result.error) {
          toast.error(result.error.message ?? 'Sign in failed');
          return;
        }

        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/admin/dashboard';
        await this.router.navigateByUrl(returnUrl);
      });
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
