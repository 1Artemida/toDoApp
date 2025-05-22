import { Component, OnInit, signal } from '@angular/core';
import { TodoCreateComponent } from './todo-create/todo-create.component';
import { TodoService } from './todo.service';
import { Task, TaskStatus } from './todo.interfaces';
import { TodoListComponent } from './todo-list/todo-list.component';
@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [TodoCreateComponent, TodoListComponent],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css',
})
export class TodoComponent implements OnInit {
  tasks = signal<Task[]>([]);

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.fetchTasks();
  }

  private fetchTasks(): void {
    this.todoService.getTasks().subscribe((tasks) => this.tasks.set(tasks));
  }

  addTask(title: string): void {
    this.todoService.addTask(title).subscribe((newTask) => {
      this.tasks.update((tasks) => [newTask, ...tasks]);
    });
  }

  toggleTaskCompletion(event: { id: number; completed: boolean }): void {
    this.todoService
      .toggleTaskCompletion(event.id, event.completed)
      .subscribe();
  }

  editTask(event: { id: number; newTitle: string }): void {
    this.todoService
      .editTask(event.id, event.newTitle)
      .subscribe(() => this.fetchTasks());
  }

  updateTaskStatus(event: { id: number; status: TaskStatus }): void {
    this.todoService.updateTaskStatus(event.id, event.status).subscribe(() => {
      this.tasks.update((tasks) =>
        tasks.map((task) =>
          task.id === event.id ? { ...task, status: event.status } : task
        )
      );
    });
  }

  clearCompleted(): void {
    if (confirm('Delete all completed tasks?')) {
      this.todoService.clearCompletedTasks().subscribe(() => this.fetchTasks());
    }
  }
}
