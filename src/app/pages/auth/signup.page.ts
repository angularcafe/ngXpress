import { Component, inject, signal } from '@angular/core';
import { email, form, FormField, minLength, required, submit, validate } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { APP_NAME } from '@core/config/app-brand';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';

@Component({
  selector: 'app-signup-page',
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
        <h1 class="text-2xl font-semibold tracking-tight">Create an account</h1>
        <p class="text-muted-foreground text-sm">Get started with {{ appName }} in minutes</p>
      </div>

      <div hlmCard>
        <div hlmCardContent class="pt-6">
          <form class="space-y-4" (submit)="onSubmit($event)">
            <hlm-field>
              <label hlmFieldLabel for="signup-name">Name</label>
              <input
                hlmInput
                id="signup-name"
                type="text"
                autocomplete="name"
                [formField]="signupForm.name"
              />
              <hlm-field-error />
            </hlm-field>

            <hlm-field>
              <label hlmFieldLabel for="signup-email">Email</label>
              <input
                hlmInput
                id="signup-email"
                type="email"
                autocomplete="email"
                [formField]="signupForm.email"
              />
              <hlm-field-error />
            </hlm-field>

            <hlm-field>
              <label hlmFieldLabel for="signup-password">Password</label>
              <input
                hlmInput
                id="signup-password"
                type="password"
                autocomplete="new-password"
                [formField]="signupForm.password"
              />
              <hlm-field-error />
            </hlm-field>

            <hlm-field>
              <label hlmFieldLabel for="signup-confirm-password">Confirm password</label>
              <input
                hlmInput
                id="signup-confirm-password"
                type="password"
                autocomplete="new-password"
                [formField]="signupForm.confirmPassword"
              />
              <hlm-field-error />
            </hlm-field>

            <button hlmBtn type="submit" class="w-full" [disabled]="isSubmitting()">
              {{ isSubmitting() ? 'Creating account...' : 'Create account' }}
            </button>
          </form>
        </div>
      </div>

      <p class="text-muted-foreground text-center text-sm">
        Already have an account?
        <a routerLink="/auth/login" class="text-primary font-medium hover:underline">Sign in</a>
      </p>
    </div>
  `,
})
export class SignupPage {
  protected readonly appName = APP_NAME;
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly isSubmitting = signal(false);

  protected readonly signupModel = signal({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  protected readonly signupForm = form(this.signupModel, (schemaPath) => {
    required(schemaPath.name, { message: 'Name is required' });
    required(schemaPath.email, { message: 'Email is required' });
    email(schemaPath.email, { message: 'Enter a valid email address' });
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
    this.isSubmitting.set(true);

    try {
      await submit(this.signupForm, async () => {
        const { name, email, password } = this.signupModel();
        const result = await this.auth.signUp(name, email, password);

        if (result.error) {
          toast.error(result.error.message ?? 'Sign up failed');
          return;
        }

        toast.success('Account created successfully');
        await this.router.navigate(['/admin/dashboard']);
      });
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
