import { Injectable } from '@angular/core';
import { Task } from './todo.interfaces';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private tasks: Task[] = [];

  addTask(name: string): void {
    this.tasks.push({ id: Date.now(), name, completed: false });
  }

  clearCompleted(): void {
    this.tasks = this.tasks.filter((t) => !t.completed);
  }

  editTask(id: number, newName: string): void {
    const task = this.tasks.find((t) => t.id === id);
    if (task) {
      task.name = newName;
    }
  }

  getTasks() {
    return [...this.tasks];
  }

  toggleTaskCompletion(id: number): void {
    const task = this.tasks.find((t) => t.id === id);
    if (task) {
      task.completed = !task.completed;
    }
  }
}
