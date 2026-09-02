import { Component, inject, signal } from '@angular/core';
import { email, form, FormField, required, submit } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';

@Component({
  selector: 'app-forgot-password-page',
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
        <h1 class="text-2xl font-semibold tracking-tight">Forgot your password?</h1>
        <p class="text-muted-foreground text-sm">
          Enter your email and we&apos;ll send you a reset link
        </p>
      </div>

      @if (emailSent()) {
        <div hlmCard>
          <div hlmCardContent class="space-y-3 pt-6">
            <p class="text-sm">If an account exists for that email, a reset link has been sent.</p>
            <p class="text-muted-foreground text-sm">
              In development, check your server terminal for the reset URL.
            </p>
            <a routerLink="/auth/login" class="text-primary text-sm font-medium hover:underline">
              Back to sign in
            </a>
          </div>
        </div>
      } @else {
        <div hlmCard>
          <div hlmCardContent class="pt-6">
            <form class="space-y-4" (submit)="onSubmit($event)">
              <hlm-field>
                <label hlmFieldLabel for="forgot-email">Email</label>
                <input
                  hlmInput
                  id="forgot-email"
                  type="email"
                  autocomplete="email"
                  [formField]="forgotForm.email"
                />
                <hlm-field-error />
              </hlm-field>

              <button hlmBtn type="submit" class="w-full" [disabled]="isSubmitting()">
                {{ isSubmitting() ? 'Sending...' : 'Send reset link' }}
              </button>
            </form>
          </div>
        </div>

        <p class="text-muted-foreground text-center text-sm">
          Remember your password?
          <a routerLink="/auth/login" class="text-primary font-medium hover:underline">Sign in</a>
        </p>
      }
    </div>
  `,
})
export class ForgotPasswordPage {
  private readonly auth = inject(AuthService);

  protected readonly isSubmitting = signal(false);
  protected readonly emailSent = signal(false);

  protected readonly forgotModel = signal({
    email: '',
  });

  protected readonly forgotForm = form(this.forgotModel, (schemaPath) => {
    required(schemaPath.email, { message: 'Email is required' });
    email(schemaPath.email, { message: 'Enter a valid email address' });
  });

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.isSubmitting.set(true);

    try {
      await submit(this.forgotForm, async () => {
        const { email } = this.forgotModel();
        const result = await this.auth.requestPasswordReset(email);

        if (result.error) {
          toast.error(result.error.message ?? 'Failed to send reset link');
          return;
        }

        this.emailSent.set(true);
        toast.success('Reset link sent if the account exists');
      });
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
