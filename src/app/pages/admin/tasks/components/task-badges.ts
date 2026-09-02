import { Component, input } from '@angular/core';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import {
  TASK_PRIORITY_LABELS,
  TASK_STATUS_LABELS,
  type TaskPriority,
  type TaskStatus,
} from '../models/task';

@Component({
  selector: 'app-task-status-badge',
  imports: [HlmBadgeImports],
  template: `
    <span
      hlmBadge
      [variant]="variant()"
      class="font-medium"
    >
      {{ TASK_STATUS_LABELS[status()] }}
    </span>
  `,
})
export class TaskStatusBadge {
  readonly status = input.required<TaskStatus>();

  protected readonly TASK_STATUS_LABELS = TASK_STATUS_LABELS;

  protected variant(): 'default' | 'secondary' | 'outline' {
    switch (this.status()) {
      case 'DONE':
        return 'secondary';
      case 'IN_PROGRESS':
        return 'default';
      default:
        return 'outline';
    }
  }
}

@Component({
  selector: 'app-task-priority-badge',
  imports: [HlmBadgeImports],
  template: `
    <span
      hlmBadge
      [variant]="variant()"
      class="font-medium"
    >
      {{ TASK_PRIORITY_LABELS[priority()] }}
    </span>
  `,
})
export class TaskPriorityBadge {
  readonly priority = input.required<TaskPriority>();

  protected readonly TASK_PRIORITY_LABELS = TASK_PRIORITY_LABELS;

  protected variant(): 'default' | 'secondary' | 'destructive' | 'outline' {
    switch (this.priority()) {
      case 'HIGH':
        return 'destructive';
      case 'MEDIUM':
        return 'default';
      default:
        return 'outline';
    }
  }
}
