import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import type {
  CreateTaskInput,
  Task,
  TaskListQuery,
  TaskListResponse,
  UpdateTaskInput,
} from '../models/task';

@Service()
export class TaskService {
  private readonly http = inject(HttpClient);

  list(query: TaskListQuery = {}): Promise<TaskListResponse> {
    let params = new HttpParams();

    if (query.search) {
      params = params.set('search', query.search);
    }
    if (query.status) {
      params = params.set('status', query.status);
    }
    if (query.priority) {
      params = params.set('priority', query.priority);
    }
    if (query.sort) {
      params = params.set('sort', query.sort);
    }
    if (query.order) {
      params = params.set('order', query.order);
    }
    if (query.page !== undefined) {
      params = params.set('page', String(query.page));
    }
    if (query.pageSize !== undefined) {
      params = params.set('pageSize', String(query.pageSize));
    }

    return firstValueFrom(
      this.http.get<TaskListResponse>('/api/tasks', {
        params,
        withCredentials: true,
      }),
    );
  }

  create(input: CreateTaskInput): Promise<Task> {
    return firstValueFrom(
      this.http.post<Task>('/api/tasks', input, {
        withCredentials: true,
      }),
    );
  }

  update(id: string, input: UpdateTaskInput): Promise<Task> {
    return firstValueFrom(
      this.http.patch<Task>(`/api/tasks/${id}`, input, {
        withCredentials: true,
      }),
    );
  }

  delete(id: string): Promise<void> {
    return firstValueFrom(
      this.http.delete<void>(`/api/tasks/${id}`, {
        withCredentials: true,
      }),
    );
  }
}
