import { Component } from '@angular/core';
import { LANDING_CONFIG } from '@pages/landing/landing.config';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmCardImports } from '@spartan-ng/helm/card';

@Component({
  selector: 'app-landing-testimonials',
  imports: [HlmAvatarImports, HlmCardImports],
  template: `
    <section id="testimonials" class="bg-muted/40 py-16 sm:py-24">
      <div class="mx-auto max-w-6xl px-6">
        <div class="mx-auto mb-12 max-w-2xl text-center">
          <h2 class="text-3xl font-semibold tracking-tight sm:text-4xl">
            {{ testimonials.title }}
          </h2>
          <p class="text-muted-foreground mt-4 text-lg">
            {{ testimonials.subtitle }}
          </p>
        </div>

        <div class="grid gap-6 md:grid-cols-3">
          @for (item of testimonials.items; track item.name) {
            <figure hlmCard class="flex flex-col p-6">
              <blockquote class="text-foreground flex-1 text-sm leading-relaxed">
                &ldquo;{{ item.quote }}&rdquo;
              </blockquote>
              <figcaption class="mt-6 flex items-center gap-3">
                <hlm-avatar class="size-10">
                  <span hlmAvatarFallback class="text-xs">{{ item.initials }}</span>
                </hlm-avatar>
                <div>
                  <p class="text-sm font-medium">{{ item.name }}</p>
                  <p class="text-muted-foreground text-xs">{{ item.role }}</p>
                </div>
              </figcaption>
            </figure>
          }
        </div>
      </div>
    </section>
  `,
})
export class LandingTestimonials {
  protected readonly testimonials = LANDING_CONFIG.testimonials;
}
