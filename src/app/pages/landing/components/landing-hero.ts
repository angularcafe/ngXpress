import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight, lucideCircle, lucideSparkles } from '@ng-icons/lucide';
import { LANDING_CONFIG } from '@pages/landing/landing.config';
import { scrollToSection } from '@pages/landing/scroll.util';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';

type PreviewTask = {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
};

@Component({
  selector: 'app-landing-hero',
  imports: [RouterLink, NgIcon, HlmBadgeImports, HlmButtonImports, HlmCardImports],
  providers: [provideIcons({ lucideSparkles, lucideArrowRight, lucideCircle })],
  template: `
    <section id="hero" class="landing-hero-gradient landing-dot-grid relative overflow-hidden py-16 sm:py-24">
      <div class="relative mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16">
        <div class="space-y-8">
          <span hlmBadge variant="secondary" class="gap-1.5">
            <ng-icon name="lucideSparkles" />
            {{ hero.badge }}
          </span>

          <div class="space-y-4">
            <h1 class="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              {{ hero.title }}
            </h1>
            <p class="text-muted-foreground max-w-xl text-lg leading-relaxed">
              {{ hero.subtitle }}
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <a hlmBtn routerLink="/auth/signup" size="lg">
              {{ hero.primaryCta }}
              <ng-icon name="lucideArrowRight" />
            </a>
            <button
              hlmBtn
              type="button"
              variant="outline"
              size="lg"
              (click)="onSecondaryClick()"
            >
              {{ hero.secondaryCta }}
            </button>
          </div>
        </div>

        <div class="relative mx-auto w-full max-w-lg lg:max-w-none">
          <div
            class="bg-card border-border shadow-primary/5 rotate-1 rounded-xl border p-4 shadow-2xl lg:rotate-2"
            aria-hidden="true"
          >
            <div class="mb-4 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="bg-muted size-3 rounded-full"></div>
                <div class="bg-muted size-3 rounded-full"></div>
                <div class="bg-muted size-3 rounded-full"></div>
              </div>
              <span class="text-muted-foreground text-xs font-medium">Cycle 12 · 4 days left</span>
            </div>

            <div class="mb-3 flex items-center justify-between">
              <span class="text-sm font-semibold">Sprint board</span>
              <span class="text-muted-foreground text-xs">6 issues</span>
            </div>

            <div class="space-y-2">
              @for (task of previewTasks; track task.id) {
                <div class="flex items-center gap-3 rounded-lg border p-3">
                  <span class="text-muted-foreground font-mono text-xs">{{ task.id }}</span>
                  <ng-icon
                    name="lucideCircle"
                    class="size-3.5 shrink-0"
                    [class]="priorityClass(task.priority)"
                  />
                  <span class="flex-1 truncate text-sm">{{ task.title }}</span>
                  <span
                    hlmBadge
                    [variant]="statusVariant(task.status)"
                    class="shrink-0 text-xs"
                  >
                    {{ statusLabel(task.status) }}
                  </span>
                </div>
              }
            </div>

            <div class="mt-4 grid grid-cols-3 gap-2 border-t pt-4">
              <div class="text-center">
                <p class="text-lg font-semibold">4</p>
                <p class="text-muted-foreground text-xs">To do</p>
              </div>
              <div class="text-center">
                <p class="text-lg font-semibold">2</p>
                <p class="text-muted-foreground text-xs">In progress</p>
              </div>
              <div class="text-center">
                <p class="text-lg font-semibold">8</p>
                <p class="text-muted-foreground text-xs">Done</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class LandingHero {
  protected readonly hero = LANDING_CONFIG.hero;

  protected readonly previewTasks: PreviewTask[] = [
    { id: 'STR-142', title: 'Redesign onboarding flow', status: 'in-progress', priority: 'high' },
    { id: 'STR-138', title: 'Add keyboard shortcuts panel', status: 'todo', priority: 'medium' },
    { id: 'STR-135', title: 'Fix notification delay on assign', status: 'done', priority: 'low' },
    { id: 'STR-129', title: 'Ship cycle analytics view', status: 'in-progress', priority: 'high' },
  ];

  protected onSecondaryClick(): void {
    scrollToSection(this.hero.secondaryHref);
  }

  protected statusLabel(status: PreviewTask['status']): string {
    switch (status) {
      case 'in-progress':
        return 'In progress';
      case 'done':
        return 'Done';
      default:
        return 'To do';
    }
  }

  protected statusVariant(status: PreviewTask['status']): 'default' | 'secondary' | 'outline' {
    switch (status) {
      case 'in-progress':
        return 'default';
      case 'done':
        return 'secondary';
      default:
        return 'outline';
    }
  }

  protected priorityClass(priority: PreviewTask['priority']): string {
    switch (priority) {
      case 'high':
        return 'text-destructive fill-destructive';
      case 'medium':
        return 'text-amber-500 fill-amber-500';
      default:
        return 'text-muted-foreground';
    }
  }
}
