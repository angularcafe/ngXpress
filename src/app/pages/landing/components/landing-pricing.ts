import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck } from '@ng-icons/lucide';
import { LANDING_CONFIG } from '@pages/landing/landing.config';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';

@Component({
  selector: 'app-landing-pricing',
  imports: [RouterLink, NgIcon, HlmBadgeImports, HlmButtonImports, HlmCardImports],
  providers: [provideIcons({ lucideCheck })],
  template: `
    <section id="pricing" class="py-16 sm:py-24">
      <div class="mx-auto max-w-6xl px-6">
        <div class="mx-auto mb-12 max-w-2xl text-center">
          <h2 class="text-3xl font-semibold tracking-tight sm:text-4xl">
            {{ pricing.title }}
          </h2>
          <p class="text-muted-foreground mt-4 text-lg">
            {{ pricing.subtitle }}
          </p>
        </div>

        <div class="grid gap-6 pt-3 lg:grid-cols-3">
          @for (tier of pricing.tiers; track tier.name) {
            <div class="relative">
              @if (tier.highlighted) {
                <span hlmBadge class="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
                  Most popular
                </span>
              }

              <div
                hlmCard
                class="flex h-full flex-col p-6"
                [class.border-primary]="tier.highlighted"
                [class.shadow-lg]="tier.highlighted"
              >
                <div class="mb-6 space-y-2">
                  <h3 class="text-lg font-semibold">{{ tier.name }}</h3>
                  <div class="flex items-baseline gap-1">
                    <span class="text-4xl font-semibold tracking-tight">{{ tier.price }}</span>
                    @if (tier.period) {
                      <span class="text-muted-foreground text-sm">{{ tier.period }}</span>
                    }
                  </div>
                  <p class="text-muted-foreground text-sm">{{ tier.description }}</p>
                </div>

                <ul class="mb-6 flex-1 space-y-3" role="list">
                  @for (feature of tier.features; track feature) {
                    <li class="flex items-start gap-2 text-sm">
                      <ng-icon name="lucideCheck" class="text-primary mt-0.5 shrink-0" />
                      <span>{{ feature }}</span>
                    </li>
                  }
                </ul>

                <a
                  hlmBtn
                  routerLink="/auth/signup"
                  [variant]="tier.highlighted ? 'default' : 'outline'"
                  class="w-full"
                >
                  {{ tier.ctaLabel }}
                </a>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class LandingPricing {
  protected readonly pricing = LANDING_CONFIG.pricing;
}
