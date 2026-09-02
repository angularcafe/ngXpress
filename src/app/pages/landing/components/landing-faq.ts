import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { LANDING_CONFIG } from '@pages/landing/landing.config';
import { HlmCollapsibleImports } from '@spartan-ng/helm/collapsible';

@Component({
  selector: 'app-landing-faq',
  imports: [NgIcon, HlmCollapsibleImports],
  providers: [provideIcons({ lucideChevronDown })],
  template: `
    <section id="faq" class="py-16 sm:py-24">
      <div class="mx-auto max-w-6xl px-6">
        <div class="mx-auto mb-12 max-w-2xl text-center">
          <h2 class="text-3xl font-semibold tracking-tight sm:text-4xl">
            {{ faq.title }}
          </h2>
          <p class="text-muted-foreground mt-4 text-lg">
            {{ faq.subtitle }}
          </p>
        </div>

        <div class="mx-auto max-w-2xl divide-y rounded-xl border">
          @for (item of faq.items; track item.question) {
            <div hlmCollapsible class="px-4">
              <button
                hlmCollapsibleTrigger
                type="button"
                class="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-medium"
              >
                {{ item.question }}
                <ng-icon
                  name="lucideChevronDown"
                  class="text-muted-foreground shrink-0 transition-transform [[data-state=open]_&]:rotate-180"
                />
              </button>
              <div hlmCollapsibleContent class="text-muted-foreground pb-4 text-sm leading-relaxed">
                {{ item.answer }}
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class LandingFaq {
  protected readonly faq = LANDING_CONFIG.faq;
}
