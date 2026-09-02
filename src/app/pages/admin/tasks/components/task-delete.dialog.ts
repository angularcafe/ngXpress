import { Component, inject, signal } from '@angular/core';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import type { Task } from '../models/task';
import { TaskService } from '../services/task.service';

export interface TaskDeleteDialogContext {
  task: Task;
}

@Component({
  selector: 'app-task-delete-dialog',
  imports: [HlmButtonImports, HlmDialogImports],
  host: {
    class: 'flex flex-col gap-4',
  },
  template: `
    <hlm-dialog-header>
      <h2 hlmDialogTitle>Delete task</h2>
      <p hlmDialogDescription>
        Are you sure you want to delete "{{ task.title }}"? This action cannot be undone.
      </p>
    </hlm-dialog-header>

    <div class="flex justify-end gap-2">
      <button hlmBtn type="button" variant="outline" hlmDialogClose>Cancel</button>
      <button hlmBtn type="button" variant="destructive" [disabled]="isDeleting()" (click)="confirmDelete()">
        {{ isDeleting() ? 'Deleting...' : 'Delete' }}
      </button>
    </div>
  `,
})
export class TaskDeleteDialog {
  private readonly dialogRef = inject<BrnDialogRef<boolean>>(BrnDialogRef);
  private readonly dialogContext = injectBrnDialogContext<TaskDeleteDialogContext>();
  private readonly taskService = inject(TaskService);

  protected readonly task = this.dialogContext.task;
  protected readonly isDeleting = signal(false);

  protected async confirmDelete(): Promise<void> {
    this.isDeleting.set(true);

    try {
      await this.taskService.delete(this.task.id);
      toast.success('Task deleted');
      this.dialogRef.close(true);
    } catch {
      toast.error('Failed to delete task');
    } finally {
      this.isDeleting.set(false);
    }
  }
}
