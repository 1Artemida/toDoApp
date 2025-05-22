import { Injectable } from '@angular/core';
import { Task, TaskStatus } from './todo.interfaces';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import {
  concatMap,
  delay,
  forkJoin,
  from,
  map,
  switchMap,
  toArray,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly apiUrl =
    'https://682f5d30f504aa3c70f3c193.mockapi.io/api/v1/todos';

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl).pipe(
      map((tasks) =>
        tasks.map((task) => ({
          ...task,
          statuses: task.status ?? {},
        }))
      )
    );
  }

  addTask(title: string): Observable<Task> {
    const payload = { title, completed: false, status: TaskStatus.medium };
    return this.http.post<Task>(this.apiUrl, payload);
  }

  editTask(id: number, newTitle: string): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, { title: newTitle });
  }

  toggleTaskCompletion(id: number, completed: boolean): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, { completed });
  }

  updateTaskStatus(id: number, status: TaskStatus): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, { status });
  }

  clearCompletedTasks(): Observable<any> {
    return this.getTasks().pipe(
      switchMap((tasks) =>
        from(tasks.filter((t) => t.completed)).pipe(
          concatMap((task) =>
            this.http.delete(`${this.apiUrl}/${task.id}`).pipe()
          ),
          toArray()
        )
      )
    );
  }
}
