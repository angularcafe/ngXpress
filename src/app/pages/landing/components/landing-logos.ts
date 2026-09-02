import { Component } from '@angular/core';
import { LANDING_CONFIG } from '@pages/landing/landing.config';

@Component({
  selector: 'app-landing-logos',
  template: `
    <section id="logos" class="border-y py-12 sm:py-16" aria-label="Trusted by">
      <div class="mx-auto max-w-6xl px-6">
        <p class="text-muted-foreground mb-8 text-center text-sm font-medium">
          {{ logos.title }}
        </p>
        <ul
          class="flex flex-wrap items-center justify-center gap-x-10 gap-y-4"
          role="list"
        >
          @for (company of logos.companies; track company) {
            <li>
              <span class="text-muted-foreground/70 text-lg font-semibold tracking-tight">
                {{ company }}
              </span>
            </li>
          }
        </ul>
      </div>
    </section>
  `,
})
export class LandingLogos {
  protected readonly logos = LANDING_CONFIG.logos;
}
