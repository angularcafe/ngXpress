import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight } from '@ng-icons/lucide';
import { LANDING_CONFIG } from '@pages/landing/landing.config';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-landing-cta',
  imports: [RouterLink, NgIcon, HlmButtonImports],
  providers: [provideIcons({ lucideArrowRight })],
  template: `
    <section id="cta" class="py-16 sm:py-24">
      <div class="mx-auto max-w-6xl px-6">
        <div
          class="bg-primary text-primary-foreground flex flex-col items-center gap-6 rounded-2xl px-6 py-12 text-center sm:px-12 sm:py-16"
        >
          <h2 class="text-3xl font-semibold tracking-tight sm:text-4xl">
            {{ cta.title }}
          </h2>
          <p class="text-primary-foreground/80 max-w-xl text-lg">
            {{ cta.subtitle }}
          </p>
          <div class="flex flex-wrap items-center justify-center gap-3">
            <a hlmBtn routerLink="/auth/signup" variant="secondary" size="lg">
              {{ cta.primaryCta }}
              <ng-icon name="lucideArrowRight" />
            </a>
            <a
              hlmBtn
              routerLink="/auth/login"
              variant="outline"
              size="lg"
              class="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
            >
              {{ cta.secondaryCta }}
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class LandingCta {
  protected readonly cta = LANDING_CONFIG.cta;
}
