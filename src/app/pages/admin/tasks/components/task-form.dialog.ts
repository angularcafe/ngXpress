import { Component, inject, signal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';
import {
  TASK_PRIORITIES,
  TASK_PRIORITY_LABELS,
  TASK_STATUSES,
  TASK_STATUS_LABELS,
  type Task,
  type TaskPriority,
  type TaskStatus,
} from '../models/task';
import { TaskService } from '../services/task.service';

export interface TaskFormContext {
  task?: Task;
}

function toDateValue(iso: string | null): Date | undefined {
  if (!iso) {
    return undefined;
  }

  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

@Component({
  selector: 'app-task-form-dialog',
  imports: [
    FormField,
    HlmButtonImports,
    HlmDatePickerImports,
    HlmDialogImports,
    HlmFieldImports,
    HlmInputImports,
    HlmLabelImports,
    HlmSelectImports,
    HlmTextareaImports,
  ],
  host: {
    class: 'flex flex-col gap-4',
  },
  template: `
    <hlm-dialog-header>
      <h2 hlmDialogTitle>{{ isEditing() ? 'Edit task' : 'Create task' }}</h2>
      <p hlmDialogDescription>
        {{ isEditing() ? 'Update task details below.' : 'Add a new task to your list.' }}
      </p>
    </hlm-dialog-header>

    <form class="space-y-4" (submit)="onSubmit($event)">
      <hlm-field>
        <label hlmFieldLabel for="task-title">Title</label>
        <input hlmInput id="task-title" type="text" [formField]="taskForm.title" />
        <hlm-field-error />
      </hlm-field>

      <hlm-field>
        <label hlmFieldLabel for="task-description">Description</label>
        <textarea
          hlmTextarea
          id="task-description"
          rows="3"
          [formField]="taskForm.description"
        ></textarea>
      </hlm-field>

      <div class="grid gap-4 sm:grid-cols-2">
        <hlm-field>
          <label hlmFieldLabel for="task-status">Status</label>
          <hlm-select
            id="task-status"
            class="w-full"
            [value]="taskModel().status"
            [itemToString]="statusToString"
            (valueChange)="updateStatus($event)"
          >
            <hlm-select-trigger class="w-full">
              <hlm-select-value placeholder="Select status" />
            </hlm-select-trigger>
            <hlm-select-content *hlmSelectPortal>
              @for (status of TASK_STATUSES; track status) {
                <hlm-select-item [value]="status">
                  {{ TASK_STATUS_LABELS[status] }}
                </hlm-select-item>
              }
            </hlm-select-content>
          </hlm-select>
        </hlm-field>

        <hlm-field>
          <label hlmFieldLabel for="task-priority">Priority</label>
          <hlm-select
            id="task-priority"
            class="w-full"
            [value]="taskModel().priority"
            [itemToString]="priorityToString"
            (valueChange)="updatePriority($event)"
          >
            <hlm-select-trigger class="w-full">
              <hlm-select-value placeholder="Select priority" />
            </hlm-select-trigger>
            <hlm-select-content *hlmSelectPortal>
              @for (priority of TASK_PRIORITIES; track priority) {
                <hlm-select-item [value]="priority">
                  {{ TASK_PRIORITY_LABELS[priority] }}
                </hlm-select-item>
              }
            </hlm-select-content>
          </hlm-select>
        </hlm-field>
      </div>

      <hlm-field>
        <label hlmFieldLabel for="task-due-date">Due date</label>
        <hlm-date-picker
          [date]="taskModel().dueDate"
          [defaultFocusedDate]="taskModel().dueDate ?? defaultFocusedDate"
          [autoCloseOnSelect]="true"
          captionLayout="dropdown"
          (dateChange)="updateDueDate($event)"
        >
          <hlm-date-picker-trigger buttonId="task-due-date" class="w-full">
            Pick a due date
          </hlm-date-picker-trigger>
        </hlm-date-picker>
      </hlm-field>

      <div class="flex justify-end gap-2">
        <button hlmBtn type="button" variant="outline" hlmDialogClose>Cancel</button>
        <button hlmBtn type="submit" [disabled]="isSubmitting()">
          {{ isSubmitting() ? 'Saving...' : isEditing() ? 'Save changes' : 'Create task' }}
        </button>
      </div>
    </form>
  `,
})
export class TaskFormDialog {
  private readonly dialogRef = inject<BrnDialogRef<boolean>>(BrnDialogRef);
  private readonly dialogContext = injectBrnDialogContext<TaskFormContext>({ optional: true });
  private readonly taskService = inject(TaskService);

  protected readonly TASK_STATUSES = TASK_STATUSES;
  protected readonly TASK_PRIORITIES = TASK_PRIORITIES;
  protected readonly TASK_STATUS_LABELS = TASK_STATUS_LABELS;
  protected readonly TASK_PRIORITY_LABELS = TASK_PRIORITY_LABELS;

  protected readonly isSubmitting = signal(false);
  protected readonly isEditing = signal(!!this.dialogContext?.task);

  protected readonly defaultFocusedDate = new Date();

  protected readonly taskModel = signal({
    title: this.dialogContext?.task?.title ?? '',
    description: this.dialogContext?.task?.description ?? '',
    status: (this.dialogContext?.task?.status ?? 'TODO') as TaskStatus,
    priority: (this.dialogContext?.task?.priority ?? 'MEDIUM') as TaskPriority,
    dueDate: toDateValue(this.dialogContext?.task?.dueDate ?? null),
  });

  protected readonly taskForm = form(this.taskModel, (schemaPath) => {
    required(schemaPath.title, { message: 'Title is required' });
  });

  protected readonly statusToString = (value: TaskStatus): string =>
    TASK_STATUS_LABELS[value] ?? value;

  protected readonly priorityToString = (value: TaskPriority): string =>
    TASK_PRIORITY_LABELS[value] ?? value;

  protected updateStatus(value: TaskStatus | null | undefined): void {
    if (!value) {
      return;
    }

    this.taskModel.update((model) => ({ ...model, status: value }));
  }

  protected updatePriority(value: TaskPriority | null | undefined): void {
    if (!value) {
      return;
    }

    this.taskModel.update((model) => ({ ...model, priority: value }));
  }

  protected updateDueDate(value: Date | null | undefined): void {
    this.taskModel.update((model) => ({ ...model, dueDate: value ?? undefined }));
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.isSubmitting.set(true);

    try {
      await submit(this.taskForm, async () => {
        const model = this.taskModel();
        const payload = {
          title: model.title.trim(),
          description: model.description.trim() || null,
          status: model.status,
          priority: model.priority,
          dueDate: model.dueDate ? model.dueDate.toISOString() : null,
        };

        try {
          if (this.dialogContext?.task) {
            await this.taskService.update(this.dialogContext.task.id, payload);
            toast.success('Task updated');
          } else {
            await this.taskService.create(payload);
            toast.success('Task created');
          }

          this.dialogRef.close(true);
        } catch {
          toast.error('Failed to save task');
        }
      });
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
