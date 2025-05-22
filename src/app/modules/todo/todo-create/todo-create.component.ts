import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo-create',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './todo-create.component.html',
  styleUrl: './todo-create.component.css'
})
export class TodoCreateComponent {
  @Output() onAddTask = new EventEmitter<string>();

  constructor() { }

  addTask(input: HTMLInputElement): void {
    if (!input) return;
    const task = input.value.trim();
    if (task) {
      this.onAddTask.emit(task);
    }
    input.value = '';
  }
}
