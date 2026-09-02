import { isPlatformBrowser } from '@angular/common';
import { Component, inject, input, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowLeft,
  lucideConstruction,
  lucideRotateCcw,
  lucideSearchX,
  lucideServerCrash,
  lucideShieldOff,
} from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import type { ErrorPageConfig } from './error.config';

@Component({
  selector: 'app-error-shell',
  imports: [RouterLink, NgIcon, HlmButtonImports],
  providers: [
    provideIcons({
      lucideSearchX,
      lucideShieldOff,
      lucideServerCrash,
      lucideConstruction,
      lucideRotateCcw,
      lucideArrowLeft,
    }),
  ],
  template: `
    <div class="bg-background relative flex min-h-svh items-center justify-center px-6 py-12 md:py-16">
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          class="bg-primary/5 absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl"
        ></div>
        <div class="bg-muted/60 absolute right-0 bottom-0 left-0 h-px"></div>
      </div>

      <main class="relative z-10 w-full max-w-2xl">
        <section class="space-y-6 text-center">
          <p
            class="text-primary/20 text-[7rem] leading-none font-semibold tracking-tighter sm:text-[9rem]"
            aria-hidden="true"
          >
            {{ config().code }}
          </p>

          <div class="space-y-4">
            <div
              class="bg-primary/10 text-primary mx-auto flex size-14 items-center justify-center rounded-2xl"
            >
              <ng-icon [name]="config().icon" class="size-7" />
            </div>

            <div class="space-y-3">
              <h1 class="text-3xl font-semibold tracking-tight sm:text-4xl">
                {{ config().title }}
              </h1>
              <p class="text-muted-foreground mx-auto max-w-xl text-base leading-relaxed">
                {{ config().description }}
              </p>
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-center gap-3">
            @for (action of config().actions; track action.label) {
              @if (action.reload) {
                <button hlmBtn [variant]="action.variant ?? 'default'" type="button" (click)="reload()">
                  <ng-icon name="lucideRotateCcw" />
                  {{ action.label }}
                </button>
              } @else if (action.back) {
                <button
                  hlmBtn
                  [variant]="action.variant ?? 'outline'"
                  type="button"
                  (click)="goBack()"
                >
                  <ng-icon name="lucideArrowLeft" />
                  {{ action.label }}
                </button>
              } @else if (action.link) {
                <a hlmBtn [variant]="action.variant ?? 'default'" [routerLink]="action.link">
                  {{ action.label }}
                </a>
              }
            }
          </div>
        </section>
      </main>
    </div>
  `,
})
export class ErrorShell {
  readonly config = input.required<ErrorPageConfig>();

  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);

  protected reload(): void {
    if (isPlatformBrowser(this.platformId)) {
      globalThis.location.reload();
    }
  }

  protected goBack(): void {
    const previousUrl = this.router.lastSuccessfulNavigation()?.previousNavigation?.finalUrl;

    if (previousUrl) {
      void this.router.navigateByUrl(previousUrl);
      return;
    }

    void this.router.navigate(['/']);
  }
}
