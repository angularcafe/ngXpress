import { Component } from '@angular/core';
import { LANDING_CONFIG } from '@pages/landing/landing.config';

@Component({
  selector: 'app-landing-how-it-works',
  template: `
    <section id="how-it-works" class="bg-muted/40 py-16 sm:py-24">
      <div class="mx-auto max-w-6xl px-6">
        <div class="mx-auto mb-12 max-w-2xl text-center">
          <h2 class="text-3xl font-semibold tracking-tight sm:text-4xl">
            {{ howItWorks.title }}
          </h2>
          <p class="text-muted-foreground mt-4 text-lg">
            {{ howItWorks.subtitle }}
          </p>
        </div>

        <ol class="grid gap-8 md:grid-cols-3">
          @for (step of howItWorks.steps; track step.step) {
            <li class="relative space-y-4">
              <div
                class="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-full text-sm font-semibold"
                aria-hidden="true"
              >
                {{ step.step }}
              </div>
              <h3 class="text-lg font-semibold">{{ step.title }}</h3>
              <p class="text-muted-foreground text-sm leading-relaxed">
                {{ step.description }}
              </p>
            </li>
          }
        </ol>
      </div>
    </section>
  `,
})
export class LandingHowItWorks {
  protected readonly howItWorks = LANDING_CONFIG.howItWorks;
}
