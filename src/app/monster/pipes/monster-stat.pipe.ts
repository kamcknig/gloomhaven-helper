import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'monsterStat',
  standalone: true
})
export class MonsterStatePipePipe implements PipeTransform {

  transform(value: string | number | undefined): string {
    return (value && value.toString()) || '-';
  }
}
