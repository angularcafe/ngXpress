import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMenu, lucideMoon, lucideSun } from '@ng-icons/lucide';
import { BrandLogo } from '@components/brand/brand-logo';
import { APP_NAME } from '@core/config/app-brand';
import { AuthService } from '@core/auth/auth.service';
import { ThemeService } from '@core/services/theme.service';
import { LANDING_CONFIG } from '@pages/landing/landing.config';
import { scrollToSection } from '@pages/landing/scroll.util';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';

@Component({
  selector: 'app-landing-header',
  imports: [RouterLink, NgIcon, BrandLogo, HlmButtonImports, HlmSheetImports],
  providers: [provideIcons({ lucideMenu, lucideSun, lucideMoon })],
  template: `
    <header class="bg-background/80 sticky top-0 z-50 border-b backdrop-blur">
      <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <app-brand-logo />

        <nav class="hidden items-center gap-6 md:flex" aria-label="Main navigation">
          @for (link of navLinks; track link.href) {
            <button
              type="button"
              class="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
              (click)="onNavClick(link.href)"
            >
              {{ link.label }}
            </button>
          }
        </nav>

        <div class="flex items-center gap-2">
          <button
            hlmBtn
            type="button"
            variant="ghost"
            size="icon"
            [attr.aria-label]="themeService.theme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
            (click)="themeService.toggle()"
          >
            @if (themeService.theme() === 'dark') {
              <ng-icon name="lucideSun" />
            } @else {
              <ng-icon name="lucideMoon" />
            }
          </button>

          @if (auth.isAuthenticated()) {
            <a hlmBtn routerLink="/admin/dashboard" class="hidden sm:inline-flex">Go to dashboard</a>
          } @else {
            <a hlmBtn routerLink="/auth/login" variant="ghost" class="hidden sm:inline-flex">Sign in</a>
            <a hlmBtn routerLink="/auth/signup" class="hidden sm:inline-flex">Get started</a>
          }

          <hlm-sheet
            side="right"
            [state]="mobileOpen() ? 'open' : 'closed'"
            (stateChanged)="onMobileStateChange($event)"
          >
            <button
              hlmBtn
              type="button"
              variant="ghost"
              size="icon"
              class="md:hidden"
              aria-label="Open navigation menu"
              [attr.aria-expanded]="mobileOpen()"
              (click)="mobileOpen.set(true)"
            >
              <ng-icon name="lucideMenu" />
            </button>
            <hlm-sheet-content *hlmSheetPortal="let ctx" class="flex w-72 flex-col gap-4">
              <div hlmSheetHeader>
                <h2 hlmSheetTitle>{{ appName }}</h2>
              </div>
              <nav class="flex flex-col gap-2" aria-label="Mobile navigation">
                @for (link of navLinks; track link.href) {
                  <button
                    type="button"
                    class="hover:bg-muted rounded-md px-3 py-2 text-left text-sm font-medium"
                    (click)="onMobileNavClick(link.href)"
                  >
                    {{ link.label }}
                  </button>
                }
              </nav>
              <div class="mt-auto flex flex-col gap-2 pt-6">
                @if (auth.isAuthenticated()) {
                  <a hlmBtn routerLink="/admin/dashboard" (click)="closeMobile()">Go to dashboard</a>
                } @else {
                  <a hlmBtn routerLink="/auth/signup" (click)="closeMobile()">Get started</a>
                  <a hlmBtn routerLink="/auth/login" variant="outline" (click)="closeMobile()">Sign in</a>
                }
              </div>
            </hlm-sheet-content>
          </hlm-sheet>
        </div>
      </div>
    </header>
  `,
})
export class LandingHeader {
  protected readonly appName = APP_NAME;
  protected readonly navLinks = LANDING_CONFIG.nav;
  protected readonly auth = inject(AuthService);
  protected readonly themeService = inject(ThemeService);
  protected readonly mobileOpen = signal(false);

  protected onNavClick(href: string): void {
    scrollToSection(href);
  }

  protected onMobileNavClick(href: string): void {
    this.closeMobile();
    scrollToSection(href);
  }

  protected onMobileStateChange(state: 'open' | 'closed'): void {
    this.mobileOpen.set(state === 'open');
  }

  protected closeMobile(): void {
    this.mobileOpen.set(false);
  }
}
