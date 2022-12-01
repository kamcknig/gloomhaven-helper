import {Pipe, PipeTransform} from '@angular/core';
import {Monster} from '../services/model';

@Pipe({
  name: 'bonusList',
  standalone: true
})
export class BonusListPipe implements PipeTransform {
  transform(value: Monster, level: number, elite: 1 | 0 = 0): string[] {
    if (!value.bonuses) {
      return [];
    }

    level--;

    return Object.entries(value.bonuses).reduce((prev, [key, bonusValue]) => {
      console.log(key, [...bonusValue]);
      console.log('checking if it\'s a number', bonusValue[level ?? 0]?.[elite] > 0)
      console.log('checking if it\'s an array', bonusValue[level ?? 0]?.[elite]?.[0] > 0)
      console.log(bonusValue[level ?? 0]?.[elite] > 0 || bonusValue[level ?? 0]?.[elite]?.[0] > 0);
      if (bonusValue[level ?? 0]?.[elite] > 0 || bonusValue[level ?? 0]?.[elite]?.[0] > 0) {
        return prev.concat(key);
      }

      return prev;
    }, []);
  }
}
