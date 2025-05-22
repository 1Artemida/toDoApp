import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../todo.interfaces';
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
  filter: 'all' | 'active' | 'completed' = 'all';
  @Input() tasks: Task[] = [];
  @Output() onToggleTask = new EventEmitter<number>();
  @Output() onClearCompleted = new EventEmitter();
  @Output() onEditTask = new EventEmitter<{ id: number; newName: string }>();

  constructor() {}

  toggleTask(task: Task): void {
    this.onToggleTask.emit(task.id);
  }

  clearCompleted(): void {
    this.onClearCompleted.emit();
  }

  editTask(task: Task): void {
    if (task.completed) {
      return;
    }
    const newName = prompt('Edit a task:', task.name);
    if (newName && newName.trim() && newName !== task.name) {
      this.onEditTask.emit({ id: task.id, newName: newName.trim() });
    }
  }

  drop(event: CdkDragDrop<Task[]>) {
    moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
  }
}
