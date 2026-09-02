import { DatePipe, isPlatformBrowser } from '@angular/common';
import { Component, computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowRight,
  lucideCheckCircle2,
  lucideCircle,
  lucideListTodo,
  lucideLoader,
} from '@ng-icons/lucide';
import { AuthService } from '@core/auth/auth.service';
import { TaskPriorityBadge, TaskStatusBadge } from '../tasks/components/task-badges';
import type { Task } from '../tasks/models/task';
import { TaskService } from '../tasks/services/task.service';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';

type DashboardStats = {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
};

@Component({
  selector: 'app-dashboard-page',
  imports: [
    DatePipe,
    RouterLink,
    NgIcon,
    HlmButtonImports,
    HlmCardImports,
    HlmSkeletonImports,
    TaskPriorityBadge,
    TaskStatusBadge,
  ],
  providers: [
    provideIcons({
      lucideListTodo,
      lucideCircle,
      lucideLoader,
      lucideCheckCircle2,
      lucideArrowRight,
    }),
  ],
  template: `
    <div class="space-y-8">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div class="space-y-1">
          <h1 class="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p class="text-muted-foreground">
            @if (userName()) {
              Welcome back, {{ userName() }}. Here is an overview of your tasks.
            } @else {
              Here is an overview of your tasks.
            }
          </p>
        </div>

        <a hlmBtn variant="outline" routerLink="/admin/tasks">
          View all tasks
          <ng-icon name="lucideArrowRight" />
        </a>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        @for (card of statCards(); track card.label) {
          <div hlmCard>
            <div hlmCardHeader class="flex flex-row items-center justify-between pb-2">
              <p hlmCardDescription>{{ card.label }}</p>
              <ng-icon [name]="card.icon" class="text-muted-foreground text-base" />
            </div>
            <div hlmCardContent>
              @if (isLoading()) {
                <hlm-skeleton class="h-8 w-16" />
              } @else {
                <p class="text-3xl font-semibold tracking-tight">{{ card.value }}</p>
              }
            </div>
          </div>
        }
      </div>

      <div class="grid gap-4 lg:grid-cols-3">
        <div hlmCard class="lg:col-span-2">
          <div hlmCardHeader class="flex flex-row items-start justify-between gap-4">
            <div class="space-y-1">
              <h2 hlmCardTitle>Recent tasks</h2>
              <p hlmCardDescription>Latest updates across your workspace.</p>
            </div>
            <a hlmBtn variant="ghost" size="sm" routerLink="/admin/tasks">See all</a>
          </div>
          <div hlmCardContent class="space-y-3">
            @if (isLoading()) {
              @for (row of skeletonRows; track row) {
                <hlm-skeleton class="h-14 w-full" />
              }
            } @else if (recentTasks().length === 0) {
              <div class="text-muted-foreground rounded-lg border border-dashed px-4 py-10 text-center text-sm">
                No tasks yet.
                <a class="text-foreground font-medium underline-offset-4 hover:underline" routerLink="/admin/tasks">
                  Go to tasks
                </a>
                to get started.
              </div>
            } @else {
              @for (task of recentTasks(); track task.id) {
                <div
                  class="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div class="min-w-0 space-y-1">
                    <p class="truncate font-medium">{{ task.title }}</p>
                    <p class="text-muted-foreground text-sm">
                      Updated {{ task.updatedAt | date: 'medium' }}
                    </p>
                  </div>
                  <div class="flex flex-wrap items-center gap-2">
                    <app-task-status-badge [status]="task.status" />
                    <app-task-priority-badge [priority]="task.priority" />
                  </div>
                </div>
              }
            }
          </div>
        </div>

        <div class="space-y-4">
          <div hlmCard>
            <div hlmCardHeader>
              <h2 hlmCardTitle>Progress</h2>
              <p hlmCardDescription>Completion across all tasks.</p>
            </div>
            <div hlmCardContent class="space-y-4">
              @if (isLoading()) {
                <hlm-skeleton class="h-4 w-full" />
                <hlm-skeleton class="h-8 w-24" />
              } @else {
                <div class="bg-muted h-2 overflow-hidden rounded-full">
                  <div
                    class="bg-primary h-full rounded-full transition-all"
                    [style.width.%]="completionRate()"
                  ></div>
                </div>
                <p class="text-3xl font-semibold tracking-tight">{{ completionRate() }}%</p>
                <p class="text-muted-foreground text-sm">
                  {{ stats()?.done ?? 0 }} of {{ stats()?.total ?? 0 }} tasks completed
                </p>
              }
            </div>
          </div>

        </div>
      </div>
    </div>
  `,
})
export class DashboardPage {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly taskService = inject(TaskService);
  private readonly auth = inject(AuthService);

  protected readonly skeletonRows = [0, 1, 2, 3, 4];
  protected readonly isLoading = signal(true);
  protected readonly stats = signal<DashboardStats | null>(null);
  protected readonly recentTasks = signal<Task[]>([]);

  protected readonly completionRate = computed(() => {
    const current = this.stats();
    if (!current || current.total === 0) {
      return 0;
    }

    return Math.round((current.done / current.total) * 100);
  });

  protected readonly statCards = computed(() => {
    const current = this.stats();

    return [
      { label: 'Total tasks', value: current?.total ?? 0, icon: 'lucideListTodo' },
      { label: 'To do', value: current?.todo ?? 0, icon: 'lucideCircle' },
      { label: 'In progress', value: current?.inProgress ?? 0, icon: 'lucideLoader' },
      { label: 'Completed', value: current?.done ?? 0, icon: 'lucideCheckCircle2' },
    ];
  });

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      void this.loadDashboard();
    }
  }

  protected userName(): string {
    return this.auth.session()?.user.name?.trim() ?? '';
  }

  private async loadDashboard(): Promise<void> {
    this.isLoading.set(true);

    try {
      const [totalResponse, todoResponse, inProgressResponse, doneResponse, recentResponse] =
        await Promise.all([
          this.taskService.list({ page: 0, pageSize: 1 }),
          this.taskService.list({ status: 'TODO', page: 0, pageSize: 1 }),
          this.taskService.list({ status: 'IN_PROGRESS', page: 0, pageSize: 1 }),
          this.taskService.list({ status: 'DONE', page: 0, pageSize: 1 }),
          this.taskService.list({ sort: 'updatedAt', order: 'desc', page: 0, pageSize: 5 }),
        ]);

      this.stats.set({
        total: totalResponse.total,
        todo: todoResponse.total,
        inProgress: inProgressResponse.total,
        done: doneResponse.total,
      });
      this.recentTasks.set(recentResponse.items);
    } catch {
      this.stats.set({ total: 0, todo: 0, inProgress: 0, done: 0 });
      this.recentTasks.set([]);
    } finally {
      this.isLoading.set(false);
    }
  }
}
