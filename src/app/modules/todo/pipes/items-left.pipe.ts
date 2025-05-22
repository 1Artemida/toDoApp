import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../todo.interfaces';

@Pipe({
  name: 'itemsLeft',
  standalone: true
})
export class ItemsLeftPipe implements PipeTransform {

  transform(tasks: Task[]): number {
    return tasks.filter(task => !task.completed).length;
  }

}
