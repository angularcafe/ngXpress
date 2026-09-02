import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { APP_NAME } from '@core/config/app-brand';

@Component({
  selector: 'app-brand-logo',
  imports: [RouterLink],
  template: `
    <a
      routerLink="/"
      class="text-foreground text-lg font-semibold tracking-tight"
      [attr.aria-label]="appName + ' home'"
    >
      {{ appName }}
    </a>
  `,
})
export class BrandLogo {
  protected readonly appName = APP_NAME;
}
