import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../todo.interfaces';

@Pipe({
  name: 'filterTasks',
  standalone: true
})
export class FilterTasksPipe implements PipeTransform {

  transform(tasks: Task[], filter: 'all' | 'active' | 'completed'): Task[] {
    if (filter === 'active') {
      return tasks.filter(task => !task.completed);
    }
    if (filter === 'completed') {
      return tasks.filter(task => task.completed);
    }
    return tasks;
  }

}
