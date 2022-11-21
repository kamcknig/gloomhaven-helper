import { Pipe, PipeTransform } from '@angular/core';
import { Monster } from '../services/model';

/**
 * A Pipe to extract a value for a given stat on a monster.
 */
@Pipe({
  name: 'monsterStat',
  standalone: true
})
export class MonsterStatPipePipe implements PipeTransform {

  /**
   * Returns the value of a given stat for a {@link Monster}. This can either be a number or a tuple of two numbers.
   *
   * If it is a tuple the first element represents the value and the second element represents some other arbitrary
   * data. Right now, the only example of the latter would be {@link ConditionsAndEffects}<em>Retaliate</em>
   * where a monster can retaliate X amount at range Y.
   *
   * @param monster The monster whose stat we are looking for
   * @param statName The name of the stat
   * @param level The level of the monster
   * @param elite 1 if elite, 0 if not
   */
  transform(monster: Monster, statName: string, level: number, elite: 0 | 1 = 0): number | [number, number] {
    level--;

    return ['health', 'move', 'attack', 'range'].includes(statName)
      ? monster.attributes[statName]?.[level ?? 0]?.[elite]
      : (['retaliate', 'pierce', 'pull', 'shield', 'target'].includes(statName.toLowerCase())
        ? [
          monster?.conditionsAndEffects?.[statName]?.[level ?? 0]?.[elite]?.[0] ?? monster?.conditionsAndEffects?.[statName]?.[level ?? 0]?.[elite],
          monster?.conditionsAndEffects?.[statName]?.[level ?? 0]?.[elite]?.[1]
        ]
        : [
          monster?.conditionsAndEffects?.[statName]?.[level ?? 0]?.[elite]?.[0] ?? monster?.conditionsAndEffects?.[statName]?.[level ?? 0]?.[elite]
        ]);
  }
}
