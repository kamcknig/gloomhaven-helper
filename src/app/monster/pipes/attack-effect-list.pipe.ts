import { Pipe, PipeTransform } from '@angular/core';
import { Monster } from '../services/model';

@Pipe({
  name: 'attackEffectList',
  standalone: true
})
/**
 * Returns a string[] of condition names from {@link AttackEffects} that a {@link Monster} at a given level
 * has. Whether the monster is elite or not also has a bearing on what elements are included
 */
export class AttackEffectListPipe implements PipeTransform {
  transform(value: Monster, level: number, elite: 1 | 0 = 0): string[] {
    level--;

    if (!value.attackEffects) {
      return [];
    }

    return Object.entries(value.attackEffects).reduce((prev, [key, attEffValue]) => {
     if (attEffValue[level ?? 0]?.[elite] > 0) {
       return prev.concat(key);
     }

     return prev;
    },[]);
  }
}
