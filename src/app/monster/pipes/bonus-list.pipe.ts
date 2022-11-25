import { Pipe, PipeTransform } from '@angular/core';
import { Monster } from '../services/model';

@Pipe({
  name: 'bonusList',
  standalone: true
})
export class BonusListPipe implements PipeTransform {
  transform(value: Monster, level: number, elite: 1 | 0 = 0): string[] {
    level--;

    if (!value.bonuses) {
      return [];
    }

    return Object.entries(value.bonuses).reduce((prev, [key, attEffValue]) => {
      if (attEffValue[level ?? 0]?.[elite] > 0 || attEffValue[level ?? 0]?.[elite]?.[0] > 0) {
        return prev.concat(key);
      }

      return prev;
    }, []);
  }
}
