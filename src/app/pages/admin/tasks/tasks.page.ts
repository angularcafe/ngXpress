import { DatePipe, isPlatformBrowser } from '@angular/common';
import { Component, computed, DestroyRef, inject, PLATFORM_ID, signal, type Signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEllipsisVertical, lucidePlus, lucideSearch } from '@ng-icons/lucide';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogService } from '@spartan-ng/helm/dialog';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { TaskDeleteDialog } from './components/task-delete.dialog';
import { TaskFormDialog } from './components/task-form.dialog';
import { TaskPriorityBadge, TaskStatusBadge } from './components/task-badges';
import {
  TASK_PRIORITIES,
  TASK_PRIORITY_LABELS,
  TASK_STATUSES,
  TASK_STATUS_LABELS,
  type Task,
  type TaskPriority,
  type TaskStatus,
} from './models/task';
import { TaskService } from './services/task.service';

@Component({
  selector: 'app-tasks-page',
  imports: [
    DatePipe,
    NgIcon,
    HlmButtonImports,
    HlmDropdownMenuImports,
    HlmInputGroupImports,
    HlmSelectImports,
    HlmSkeletonImports,
    HlmTableImports,
    TaskPriorityBadge,
    TaskStatusBadge,
  ],
  providers: [provideIcons({ lucideEllipsisVertical, lucidePlus, lucideSearch })],
  template: `
    <div class="min-w-0 space-y-6">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-1">
          <h1 class="text-3xl font-semibold tracking-tight">Tasks</h1>
          <p class="text-muted-foreground">Manage your tasks with search, filters, and pagination.</p>
        </div>
        <button hlmBtn type="button" (click)="openCreateDialog()">
          <ng-icon name="lucidePlus" />
          Add task
        </button>
      </div>

      <div class="flex flex-col gap-3 lg:flex-row lg:items-center">
        <hlm-input-group class="w-full lg:max-w-sm">
          <input
            hlmInputGroupInput
            type="search"
            placeholder="Search tasks..."
            [value]="searchQuery()"
            (input)="onSearchInput($event)"
          />
          <hlm-input-group-addon>
            <ng-icon name="lucideSearch" />
          </hlm-input-group-addon>
        </hlm-input-group>

        <hlm-select
          class="w-full sm:w-44"
          [value]="statusFilter()"
          [itemToString]="statusToString"
          (valueChange)="onStatusFilterChange($event)"
        >
          <hlm-select-trigger class="w-full">
            <hlm-select-value placeholder="All statuses" />
          </hlm-select-trigger>
          <hlm-select-content *hlmSelectPortal>
            <hlm-select-item [value]="allFilterValue">All statuses</hlm-select-item>
            @for (status of TASK_STATUSES; track status) {
              <hlm-select-item [value]="status">
                {{ TASK_STATUS_LABELS[status] }}
              </hlm-select-item>
            }
          </hlm-select-content>
        </hlm-select>

        <hlm-select
          class="w-full sm:w-44"
          [value]="priorityFilter()"
          [itemToString]="priorityToString"
          (valueChange)="onPriorityFilterChange($event)"
        >
          <hlm-select-trigger class="w-full">
            <hlm-select-value placeholder="All priorities" />
          </hlm-select-trigger>
          <hlm-select-content *hlmSelectPortal>
            <hlm-select-item [value]="allFilterValue">All priorities</hlm-select-item>
            @for (priority of TASK_PRIORITIES; track priority) {
              <hlm-select-item [value]="priority">
                {{ TASK_PRIORITY_LABELS[priority] }}
              </hlm-select-item>
            }
          </hlm-select-content>
        </hlm-select>
      </div>

      <div
        hlmTableContainer
        class="min-w-0 w-full rounded-lg border transition-opacity"
        [class.opacity-60]="isRefreshing()"
        [attr.aria-busy]="isRefreshing()"
      >
        <table hlmTable class="w-full">
          <thead hlmTHead>
            <tr hlmTr>
              <th hlmTh class="w-full max-w-0">Title</th>
              <th hlmTh class="w-px">Status</th>
              <th hlmTh class="w-px">Priority</th>
              <th hlmTh class="w-px">Due date</th>
              <th hlmTh class="w-px">Updated</th>
              <th hlmTh class="w-px text-end">Actions</th>
            </tr>
          </thead>
          <tbody hlmTBody>
            @if (!hasLoaded() && isLoading()) {
              @for (row of skeletonRows; track row) {
                <tr hlmTr>
                  <td hlmTd colspan="6">
                    <hlm-skeleton class="h-8 w-full" />
                  </td>
                </tr>
              }
            } @else if (tasks().length === 0) {
              <tr hlmTr>
                <td hlmTd colspan="6" class="text-muted-foreground whitespace-normal! py-10 text-center">
                  No tasks found. Create your first task to get started.
                </td>
              </tr>
            } @else {
              @for (task of tasks(); track task.id) {
                <tr hlmTr>
                  <td hlmTd class="max-w-0 w-full align-top whitespace-normal!">
                    <div class="min-w-0 space-y-0.5 overflow-hidden">
                      <p class="truncate font-medium" [title]="task.title">{{ task.title }}</p>
                      @if (task.description) {
                        <p
                          class="text-muted-foreground truncate text-sm"
                          [title]="task.description"
                        >
                          {{ task.description }}
                        </p>
                      }
                    </div>
                  </td>
                  <td hlmTd class="w-px align-top">
                    <app-task-status-badge [status]="task.status" />
                  </td>
                  <td hlmTd class="w-px align-top">
                    <app-task-priority-badge [priority]="task.priority" />
                  </td>
                  <td hlmTd class="w-px align-top">
                    @if (task.dueDate) {
                      <span class="whitespace-nowrap">{{ task.dueDate | date: 'mediumDate' }}</span>
                    } @else {
                      <span class="text-muted-foreground">—</span>
                    }
                  </td>
                  <td hlmTd class="w-px align-top">
                    <span class="whitespace-nowrap">{{ task.updatedAt | date: 'medium' }}</span>
                  </td>
                  <td hlmTd class="w-px text-end align-top">
                    <button
                      hlmBtn
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      [hlmDropdownMenuTrigger]="actionsMenu"
                      aria-label="Open task actions"
                    >
                      <ng-icon name="lucideEllipsisVertical" />
                    </button>
                    <ng-template #actionsMenu>
                      <div hlmDropdownMenu class="w-40">
                        <button hlmDropdownMenuItem type="button" (click)="openEditDialog(task)">
                          Edit
                        </button>
                        <button
                          hlmDropdownMenuItem
                          type="button"
                          variant="destructive"
                          (click)="openDeleteDialog(task)"
                        >
                          Delete
                        </button>
                      </div>
                    </ng-template>
                  </td>
                </tr>
              }
            }
          </tbody>
        </table>
      </div>

      <div class="flex items-center justify-between gap-4">
        <p class="text-muted-foreground text-sm">
          {{ total() }} task{{ total() === 1 ? '' : 's' }}
        </p>
        <div class="flex items-center gap-2">
          <button
            hlmBtn
            type="button"
            variant="outline"
            size="sm"
            [disabled]="page() === 0 || isLoading()"
            (click)="previousPage()"
          >
            Previous
          </button>
          <span class="text-muted-foreground text-sm">
            Page {{ page() + 1 }} of {{ totalPages() }}
          </span>
          <button
            hlmBtn
            type="button"
            variant="outline"
            size="sm"
            [disabled]="page() + 1 >= totalPages() || isLoading()"
            (click)="nextPage()"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  `,
})
export class TasksPage {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogService = inject(HlmDialogService);
  private readonly taskService = inject(TaskService);

  protected readonly TASK_STATUSES = TASK_STATUSES;
  protected readonly TASK_PRIORITIES = TASK_PRIORITIES;
  protected readonly TASK_STATUS_LABELS = TASK_STATUS_LABELS;
  protected readonly TASK_PRIORITY_LABELS = TASK_PRIORITY_LABELS;
  protected readonly allFilterValue = 'ALL';
  protected readonly skeletonRows = [0, 1, 2, 3, 4];

  protected readonly searchQuery = signal('');
  protected readonly statusFilter = signal<string>(this.allFilterValue);
  protected readonly priorityFilter = signal<string>(this.allFilterValue);
  protected readonly page = signal(0);
  protected readonly pageSize = signal(10);
  protected readonly total = signal(0);
  protected readonly tasks = signal<Task[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly hasLoaded = signal(false);

  protected readonly isRefreshing: Signal<boolean> = computed(
    () => this.isLoading() && this.hasLoaded(),
  );

  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.total() / this.pageSize())),
  );

  private searchTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      void this.loadTasks();
    }
  }

  protected onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
    this.page.set(0);

    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout(() => {
      void this.loadTasks();
    }, 300);
  }

  protected onStatusFilterChange(value: string | null | undefined): void {
    this.statusFilter.set(value ?? this.allFilterValue);
    this.page.set(0);
    void this.loadTasks();
  }

  protected onPriorityFilterChange(value: string | null | undefined): void {
    this.priorityFilter.set(value ?? this.allFilterValue);
    this.page.set(0);
    void this.loadTasks();
  }

  protected readonly statusToString = (value: string): string => {
    if (value === this.allFilterValue) {
      return 'All statuses';
    }

    return TASK_STATUS_LABELS[value as TaskStatus] ?? value;
  };

  protected readonly priorityToString = (value: string): string => {
    if (value === this.allFilterValue) {
      return 'All priorities';
    }

    return TASK_PRIORITY_LABELS[value as TaskPriority] ?? value;
  };

  protected previousPage(): void {
    this.page.update((current) => Math.max(0, current - 1));
    void this.loadTasks();
  }

  protected nextPage(): void {
    this.page.update((current) => current + 1);
    void this.loadTasks();
  }

  protected openCreateDialog(): void {
    this.dialogService
      .open(TaskFormDialog, {
        contentClass: 'sm:min-w-lg',
      })
      .closed$.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((saved) => {
        if (saved) {
          void this.loadTasks();
        }
      });
  }

  protected openEditDialog(task: Task): void {
    this.dialogService
      .open(TaskFormDialog, {
        context: { task },
        contentClass: 'sm:min-w-lg',
      })
      .closed$.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((saved) => {
        if (saved) {
          void this.loadTasks();
        }
      });
  }

  protected openDeleteDialog(task: Task): void {
    this.dialogService
      .open(TaskDeleteDialog, {
        context: { task },
        contentClass: 'sm:min-w-md',
      })
      .closed$.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((deleted) => {
        if (deleted) {
          void this.loadTasks();
        }
      });
  }

  private async loadTasks(): Promise<void> {
    this.isLoading.set(true);

    try {
      const status =
        this.statusFilter() === this.allFilterValue
          ? undefined
          : (this.statusFilter() as TaskStatus);
      const priority =
        this.priorityFilter() === this.allFilterValue
          ? undefined
          : (this.priorityFilter() as TaskPriority);

      const response = await this.taskService.list({
        search: this.searchQuery().trim() || undefined,
        status,
        priority,
        sort: 'updatedAt',
        order: 'desc',
        page: this.page(),
        pageSize: this.pageSize(),
      });

      this.tasks.set(response.items);
      this.total.set(response.total);

      if (response.page !== this.page()) {
        this.page.set(response.page);
      }
    } catch {
      toast.error('Failed to load tasks');
      this.tasks.set([]);
      this.total.set(0);
    } finally {
      this.isLoading.set(false);
      this.hasLoaded.set(true);
    }
  }
}
