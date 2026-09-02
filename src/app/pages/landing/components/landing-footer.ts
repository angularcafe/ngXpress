import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BrandLogo } from '@components/brand/brand-logo';
import { APP_NAME } from '@core/config/app-brand';
import { LANDING_CONFIG } from '@pages/landing/landing.config';
import { scrollToSection } from '@pages/landing/scroll.util';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';

@Component({
  selector: 'app-landing-footer',
  imports: [BrandLogo, HlmSeparatorImports],
  template: `
    <footer class="border-t py-12 sm:py-16">
      <div class="mx-auto max-w-6xl px-6">
        <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div class="space-y-3 sm:col-span-2 lg:col-span-1">
            <app-brand-logo />
            <p class="text-muted-foreground text-sm leading-relaxed">
              {{ footer.tagline }}
            </p>
          </div>

          @for (column of footer.columns; track column.title) {
            <div>
              <h3 class="mb-3 text-sm font-semibold">{{ column.title }}</h3>
              <ul class="space-y-2" role="list">
                @for (link of column.links; track link.label) {
                  <li>
                    @if (link.href.startsWith('#')) {
                      <button
                        type="button"
                        class="text-muted-foreground hover:text-foreground text-sm transition-colors"
                        (click)="onLinkClick(link.href)"
                      >
                        {{ link.label }}
                      </button>
                    } @else {
                      <a
                        [href]="link.href"
                        class="text-muted-foreground hover:text-foreground text-sm transition-colors"
                      >
                        {{ link.label }}
                      </a>
                    }
                  </li>
                }
              </ul>
            </div>
          }
        </div>

        <hlm-separator class="my-8" />

        <p class="text-muted-foreground text-center text-sm">
          &copy; {{ year }} {{ appName }}. All rights reserved.
        </p>
      </div>
    </footer>
  `,
})
export class LandingFooter {
  protected readonly appName = APP_NAME;
  protected readonly footer = LANDING_CONFIG.footer;
  protected readonly year = new Date().getFullYear();

  protected onLinkClick(href: string): void {
    scrollToSection(href);
  }
}
