import { Pipe, PipeTransform } from '@angular/core';
import { Task, TaskStatus, TaskStates } from '../todo.interfaces';

@Pipe({
  name: 'filterTasks',
  standalone: true,
})
export class FilterTasksPipe implements PipeTransform {
  transform(tasks: Task[] = [], filter: TaskStates | TaskStatus): Task[] {
    if (!Array.isArray(tasks)) return [];

    switch (filter) {
      case 'active':
        return tasks.filter((task) => !task.completed);
      case 'completed':
        return tasks.filter((task) => task.completed);
      case 'low':
      case 'medium':
      case 'high':
        return tasks.filter((task) => task.status === filter);
      default:
        return tasks;
    }
  }
}
