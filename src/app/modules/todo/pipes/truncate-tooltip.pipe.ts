import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateTooltip',
  standalone: true
})
export class TruncateTooltipPipe implements PipeTransform {

  transform(value: string, maxLenght: number = 50): string {
    if (!value) return '';

    if (value.length > maxLenght) {
      return value.substring(0, maxLenght) + '...';
    }
    return value;
  }

}
