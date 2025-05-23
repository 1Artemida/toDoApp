import { Injectable } from '@angular/core';
import { Task, TaskStatus } from './todo.interfaces';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, concatMap, from, map, switchMap, toArray } from 'rxjs';
import { handleError } from './utils/error-handler.util';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly apiUrl =
    'https://682f5d30f504aa3c70f3c193.mockapi.io/api/v1/todos';

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  private handle<T>(obs: Observable<T>, fallbackMsg: string): Observable<T> {
    return obs.pipe(catchError(handleError(fallbackMsg, this.toastr)));
  }

  private putTask<T>(
    id: number,
    payload: Partial<Task>,
    msg: string
  ): Observable<T> {
    return this.handle(this.http.put<T>(`${this.apiUrl}/${id}`, payload), msg);
  }

  getTasks(): Observable<Task[]> {
    return this.handle(
      this.http
        .get<Task[]>(this.apiUrl)
        .pipe(
          map((tasks) =>
            tasks.map((task) => ({ ...task, status: task.status }))
          )
        ),
      'Loading tasks'
    );
  }

  addTask(title: string): Observable<Task> {
    const payload = { title, completed: false, status: TaskStatus.medium };
    return this.handle(this.http.post<Task>(this.apiUrl, payload), 'Add task');
  }

  editTask(id: number, newTitle: string): Observable<Task> {
    return this.putTask<Task>(id, { title: newTitle }, 'Edit task');
  }

  toggleTaskCompletion(id: number, completed: boolean): Observable<Task> {
    return this.putTask<Task>(id, { completed }, 'Toggle task completion');
  }

  updateTaskStatus(id: number, status: TaskStatus): Observable<Task> {
    return this.putTask<Task>(id, { status }, 'Update task status');
  }

  clearCompletedTasks(): Observable<any> {
    return this.getTasks().pipe(
      switchMap((tasks) =>
        from(tasks.filter((t) => t.completed)).pipe(
          concatMap((task) =>
            this.handle(
              this.http.delete(`${this.apiUrl}/${task.id}`),
              `Delete task with id: ${task.id}`
            )
          ),
          toArray()
        )
      ),
      catchError(handleError('Clear completed tasks', this.toastr))
    );
  }
}
