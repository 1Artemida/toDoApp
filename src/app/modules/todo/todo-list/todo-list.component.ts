import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task, TaskStatus } from '../todo.interfaces';
import { CommonModule } from '@angular/common';
import { TruncateTooltipPipe } from '../pipes/truncate-tooltip.pipe';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ItemsLeftPipe } from '../pipes/items-left.pipe';
import { FilterTasksPipe } from '../pipes/filter-tasks.pipe';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    CommonModule,
    TruncateTooltipPipe,
    DragDropModule,
    ItemsLeftPipe,
    FilterTasksPipe,
  ],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css',
})
export class TodoListComponent {
  TaskStatus = TaskStatus;
  filter: 'all' | 'active' | 'completed' | TaskStatus = 'all';
  @Input() tasks: Task[] = [];
  @Output() onToggleTask = new EventEmitter<{
    id: number;
    completed: boolean;
  }>();
  @Output() onEditTask = new EventEmitter<{ id: number; newTitle: string }>();
  @Output() onStatusChange = new EventEmitter<{
    id: number;
    status: TaskStatus;
  }>();
  @Output() onClearCompleted = new EventEmitter();

  constructor() {}

  toggleTask(task: Task, event: Event): void {
    this.onToggleTask.emit({
      id: task.id,
      completed: (event.target as HTMLInputElement).checked,
    });
  }

  clearCompleted(): void {
    this.onClearCompleted.emit();
  }

  editTask(task: Task): void {
    if (task.completed) {
      return;
    }
    const newTitle = prompt('Edit a task:', task.title);
    if (newTitle && newTitle !== task.title) {
      this.onEditTask.emit({ id: task.id, newTitle });
    }
  }

  changeStatus(task: Task, status: TaskStatus): void {
    if (task.status === status) return;
    this.onStatusChange.emit({ id: task.id, status });
  }

  handleStatusChange(taskId: number, event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newStatus = target.value as unknown as TaskStatus;
    this.onStatusChange.emit({ id: taskId, status: newStatus });
  }

  drop(event: CdkDragDrop<Task[]>) {
    moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
  }
}
