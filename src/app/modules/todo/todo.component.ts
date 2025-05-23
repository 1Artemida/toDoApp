import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { TodoCreateComponent } from './todo-create/todo-create.component';
import { TodoService } from './todo.service';
import { Task, TaskStatus } from './todo.interfaces';
import { TodoListComponent } from './todo-list/todo-list.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [TodoCreateComponent, TodoListComponent],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css',
})
export class TodoComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  tasks = signal<Task[]>([]);
  isDeleting = false;

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.todoService
      .getTasks()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((tasks) => this.tasks.set(tasks));
  }

  private fetchTasks(): void {
    this.todoService
      .getTasks()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((tasks) => this.tasks.set(tasks));
  }

  addTask(title: string): void {
    this.todoService.addTask(title).subscribe((newTask) => {
      this.tasks.update((tasks) => [newTask, ...tasks]);
    });
  }

  toggleTaskCompletion(event: { id: number; completed: boolean }): void {
    this.todoService
      .toggleTaskCompletion(event.id, event.completed)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.tasks.update((tasks) =>
          tasks.map((task) =>
            task.id === event.id
              ? { ...task, completed: event.completed }
              : task
          )
        );
      });
  }

  editTask(event: { id: number; newTitle: string }): void {
    this.todoService
      .editTask(event.id, event.newTitle)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.fetchTasks());
  }

  updateTaskStatus(event: { id: number; status: TaskStatus }): void {
    this.todoService
      .updateTaskStatus(event.id, event.status)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.tasks.update((tasks) =>
          tasks.map((task) =>
            task.id === event.id ? { ...task, status: event.status } : task
          )
        );
      });
  }

  clearCompleted(): void {
    if (!confirm('Delete all COMPLETED tasks?')) return;

    this.isDeleting = true;

    this.todoService
      .clearCompletedTasks()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.fetchTasks());
  }
}
