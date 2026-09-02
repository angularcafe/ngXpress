import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBarChart3,
  lucideBell,
  lucideKanban,
  lucideListTodo,
  lucideUsers,
  lucideZap,
} from '@ng-icons/lucide';
import { LANDING_CONFIG } from '@pages/landing/landing.config';
import { HlmCardImports } from '@spartan-ng/helm/card';

@Component({
  selector: 'app-landing-features',
  imports: [NgIcon, HlmCardImports],
  providers: [
    provideIcons({
      lucideListTodo,
      lucideKanban,
      lucideZap,
      lucideUsers,
      lucideBarChart3,
      lucideBell,
    }),
  ],
  template: `
    <section id="features" class="py-16 sm:py-24">
      <div class="mx-auto max-w-6xl px-6">
        <div class="mx-auto mb-12 max-w-2xl text-center">
          <h2 class="text-3xl font-semibold tracking-tight sm:text-4xl">
            {{ features.title }}
          </h2>
          <p class="text-muted-foreground mt-4 text-lg">
            {{ features.subtitle }}
          </p>
        </div>

        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          @for (feature of features.items; track feature.title) {
            <div hlmCard class="p-6">
              <div
                class="bg-primary/10 text-primary mb-4 flex size-10 items-center justify-center rounded-lg"
              >
                <ng-icon [name]="feature.icon" class="text-lg" />
              </div>
              <h3 class="mb-2 text-lg font-semibold">{{ feature.title }}</h3>
              <p class="text-muted-foreground text-sm leading-relaxed">
                {{ feature.description }}
              </p>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class LandingFeatures {
  protected readonly features = LANDING_CONFIG.features;
}
