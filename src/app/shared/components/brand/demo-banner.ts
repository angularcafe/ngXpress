import { isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, inject, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBadgeInfo, lucideX } from '@ng-icons/lucide';
import { APP_TEMPLATE_NAME, APP_TEMPLATE_URL } from '@core/config/app-brand';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmButtonImports } from '@spartan-ng/helm/button';

const STORAGE_KEY = 'ngxpress-demo-banner-dismissed';

@Component({
  selector: 'app-demo-banner',
  imports: [NgIcon, HlmAlertImports, HlmButtonImports],
  providers: [provideIcons({ lucideX, lucideBadgeInfo })],
  template: `
    @if (!dismissed()) {
      <hlm-alert
        class="border-blue-200 bg-blue-50 text-center text-blue-900 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-50"
      >
        <p hlmAlertDescription class="text-center"><ng-icon name="lucideBadgeInfo" class="me-1.5 inline-block size-4" /><span class="font-medium">Demo site.</span> This is a demo built with <a [href]="templateUrl" target="_blank" rel="noopener noreferrer">{{ templateName }}</a>. Explore the template, sign up, and try the dashboard.</p>
        <div hlmAlertAction>
          <button
            hlmBtn
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label="Dismiss demo notice"
            (click)="dismiss()"
          >
            <ng-icon name="lucideX" />
          </button>
        </div>
      </hlm-alert>
    }
  `,
})
export class DemoBanner {
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly templateName = APP_TEMPLATE_NAME;
  protected readonly templateUrl = APP_TEMPLATE_URL;
  protected readonly dismissed = signal(this.readDismissed());

  protected dismiss(): void {
    this.dismissed.set(true);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(STORAGE_KEY, 'true');
    }
  }

  private readDismissed(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    return localStorage.getItem(STORAGE_KEY) === 'true';
  }
}
