import { Pipe, PipeTransform } from '@angular/core';
import { Monster } from '../services/model';

@Pipe({
  name: 'conditionList',
  standalone: true
})
/**
 * Returns a string[] of condition names from {@link Conditions} that a {@link Monster} at a given level
 * has. Whether the monster is elite or not also has a bearing on what elements are included
 */
export class ConditionListPipe implements PipeTransform {

  transform(value: Monster, level: number = 1, elite: 1 | 0 = 0): string[] {
    level--;

    if (!value.conditions) {
      return [];
    }

    return Object.entries(value.conditions).reduce((prev, [key, conValue]) => {
      if (conValue[level ?? 0]?.[elite] > 0) {
        return prev.concat(key);
      }

      return prev;
    },[]);
  }
}
