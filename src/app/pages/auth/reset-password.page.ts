import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { form, FormField, minLength, required, submit, validate } from '@angular/forms/signals';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';

@Component({
  selector: 'app-reset-password-page',
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
        <h1 class="text-2xl font-semibold tracking-tight">Reset your password</h1>
        <p class="text-muted-foreground text-sm">Enter a new password for your account</p>
      </div>

      @if (tokenError()) {
        <div hlmCard>
          <div hlmCardContent class="space-y-3 pt-6">
            <p class="text-destructive text-sm">
              This reset link is invalid or has expired. Request a new one.
            </p>
            <a
              routerLink="/auth/forgot-password"
              class="text-primary text-sm font-medium hover:underline"
            >
              Request a new reset link
            </a>
          </div>
        </div>
      } @else {
        <div hlmCard>
          <div hlmCardContent class="pt-6">
            <form class="space-y-4" (submit)="onSubmit($event)">
              <hlm-field>
                <label hlmFieldLabel for="reset-password">New password</label>
                <input
                  hlmInput
                  id="reset-password"
                  type="password"
                  autocomplete="new-password"
                  [formField]="resetForm.password"
                />
                <hlm-field-error />
              </hlm-field>

              <hlm-field>
                <label hlmFieldLabel for="reset-confirm-password">Confirm password</label>
                <input
                  hlmInput
                  id="reset-confirm-password"
                  type="password"
                  autocomplete="new-password"
                  [formField]="resetForm.confirmPassword"
                />
                <hlm-field-error />
              </hlm-field>

              <button hlmBtn type="submit" class="w-full" [disabled]="isSubmitting()">
                {{ isSubmitting() ? 'Resetting...' : 'Reset password' }}
              </button>
            </form>
          </div>
        </div>
      }
    </div>
  `,
})
export class ResetPasswordPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly isSubmitting = signal(false);
  private readonly queryParams = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });
  protected readonly tokenError = computed(() => {
    const params = this.queryParams();
    return params.get('error') === 'INVALID_TOKEN' || !params.get('token');
  });

  protected readonly resetModel = signal({
    password: '',
    confirmPassword: '',
  });

  protected readonly resetForm = form(this.resetModel, (schemaPath) => {
    required(schemaPath.password, { message: 'Password is required' });
    minLength(schemaPath.password, 8, { message: 'Password must be at least 8 characters' });
    required(schemaPath.confirmPassword, { message: 'Please confirm your password' });
    validate(schemaPath.confirmPassword, ({ value, stateOf }) => {
      if (value() !== stateOf(schemaPath.password).value()) {
        return { kind: 'mismatch', message: 'Passwords do not match' };
      }
      return undefined;
    });
  });

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    const token = this.queryParams()?.get('token');
    if (!token) {
      return;
    }

    this.isSubmitting.set(true);

    try {
      await submit(this.resetForm, async () => {
        const { password } = this.resetModel();
        const result = await this.auth.resetPassword(token, password);

        if (result.error) {
          toast.error(result.error.message ?? 'Failed to reset password');
          return;
        }

        toast.success('Password reset successfully');
        await this.router.navigate(['/auth/login']);
      });
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
