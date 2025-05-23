import { Injectable } from '@angular/core';
import { Task, TaskStatus } from './todo.interfaces';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import {
  catchError,
  concatMap,
  from,
  map,
  switchMap,
  toArray,
} from 'rxjs';
import { handleError } from './utils/error-handler.util';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly apiUrl =
    'https://682f5d30f504aa3c70f3c193.mockapi.io/api/v1/todos';

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl).pipe(
      map((tasks) =>
        tasks.map((task) => ({
          ...task,
          statuses: task.status ?? {},
        }))
      ),
      catchError(handleError('Loading tasks', this.toastr))
    );
  }

  addTask(title: string): Observable<Task> {
    const payload = { title, completed: false, status: TaskStatus.medium };
    return this.http
      .post<Task>(this.apiUrl, payload)
      .pipe(catchError(handleError('Add task', this.toastr)));
  }

  editTask(id: number, newTitle: string): Observable<Task> {
    return this.http
      .put<Task>(`${this.apiUrl}/${id}`, { title: newTitle })
      .pipe(catchError(handleError('Edit task', this.toastr)));
  }

  toggleTaskCompletion(id: number, completed: boolean): Observable<Task> {
    return this.http
      .put<Task>(`${this.apiUrl}/${id}`, { completed })
      .pipe(catchError(handleError('Toggle task completion', this.toastr)));
  }

  updateTaskStatus(id: number, status: TaskStatus): Observable<Task> {
    return this.http
      .put<Task>(`${this.apiUrl}/${id}`, { status })
      .pipe(
        catchError(handleError('Update the status of a task', this.toastr))
      );
  }

  clearCompletedTasks(): Observable<any> {
    return this.getTasks().pipe(
      switchMap((tasks) =>
        from(tasks.filter((t) => t.completed)).pipe(
          concatMap((task) =>
            this.http
              .delete(`${this.apiUrl}/${task.id}`)
              .pipe(catchError(handleError(`Delete task with id: ${task.id}`)))
          ),
          toArray()
        )
      ),
      catchError(handleError('Clear completed tasks', this.toastr))
    );
  }
}
