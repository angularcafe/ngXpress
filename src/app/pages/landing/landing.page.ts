import { Component, inject, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DemoBanner } from '@components/brand/demo-banner';
import { LANDING_CONFIG } from './landing.config';
import { LandingCta } from './components/landing-cta';
import { LandingFaq } from './components/landing-faq';
import { LandingFeatures } from './components/landing-features';
import { LandingFooter } from './components/landing-footer';
import { LandingHeader } from './components/landing-header';
import { LandingHero } from './components/landing-hero';
import { LandingHowItWorks } from './components/landing-how-it-works';
import { LandingLogos } from './components/landing-logos';
import { LandingPricing } from './components/landing-pricing';
import { LandingTestimonials } from './components/landing-testimonials';

@Component({
  selector: 'app-landing-page',
  imports: [
    DemoBanner,
    LandingHeader,
    LandingHero,
    LandingLogos,
    LandingFeatures,
    LandingHowItWorks,
    LandingPricing,
    LandingTestimonials,
    LandingFaq,
    LandingCta,
    LandingFooter,
  ],
  template: `
    <a
      href="#main-content"
      class="bg-primary text-primary-foreground focus:ring-ring sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:px-4 focus:py-2 focus:ring-2"
    >
      Skip to content
    </a>

    <app-demo-banner />
    <app-landing-header />

    <main id="main-content">
      <app-landing-hero />
      <app-landing-logos />
      <app-landing-features />
      <app-landing-how-it-works />
      <app-landing-pricing />
      <app-landing-testimonials />
      <app-landing-faq />
      <app-landing-cta />
    </main>

    <app-landing-footer />
  `,
})
export class LandingPage implements OnInit {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  ngOnInit(): void {
    this.title.setTitle(LANDING_CONFIG.meta.title);
    this.meta.updateTag({ name: 'description', content: LANDING_CONFIG.meta.description });
  }
}
