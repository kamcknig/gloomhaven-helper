import {Pipe, PipeTransform} from '@angular/core';
import {isAttackEffect, isBonus, isCondition, Monster} from '../services/model';

/**
 * A Pipe to extract a value for a given stat on a monster.
 */
@Pipe({
  name: 'monsterStat',
  standalone: true
})
export class MonsterStatPipe implements PipeTransform {

  /**
   * Returns the value of a given stat for a {@link Monster.conditions}, {@link Monster.attackEffects},
   * or {@link Monster.bonuses}. This can either be a number or a tuple of two numbers.
   *
   * If it is a tuple the first element represents the value and the second element represents some other arbitrary
   * data. Right now, the only example of the latter would be {@link Bonus.retaliate}
   * where a monster can retaliate X amount at range Y.
   *
   * @param monster The monster whose stat we are looking for
   * @param statName The name of the stat
   * @param level The level of the monster.
   * @param elite 1 if elite, 0 if not
   */
  transform(monster: Monster, statName: string, level: number, elite: 0 | 1 = 0): number | [number, number] {
    if (!monster) {
      return 0;
    }

    level--;

    if (['health', 'move', 'attack', 'range'].includes(statName)) {
      return monster.attributes[statName]?.[level ?? 0]?.[elite];
    } else if (isCondition(statName)) {
      return [
        monster?.conditions?.[statName]?.[level ?? 0]?.[elite],
        monster?.conditions?.[statName]?.[level ?? 0]?.[elite]?.[1]
      ]
    } else if (isAttackEffect(statName)) {
      return [
        monster?.attackEffects?.[statName]?.[level ?? 0]?.[elite],
        monster?.attackEffects?.[statName]?.[level ?? 0]?.[elite]?.[1]
      ]
    } else if (isBonus(statName)) {
      return [
        monster?.bonuses?.[statName]?.[level ?? 0]?.[elite]?.[0] ?? monster?.bonuses?.[statName]?.[level ?? 0]?.[elite],
        monster?.bonuses?.[statName]?.[level ?? 0]?.[elite]?.[1]
      ];
    }

    return 0;
  }
}
