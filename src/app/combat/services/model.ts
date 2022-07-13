import { MonsterAbilityCard } from '../../monster/services/model';

export type CombatState = {
  round: number;
  [monsterId: number]: MonsterAbilityCard[];
};
