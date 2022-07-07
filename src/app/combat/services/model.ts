import { MonsterAbilityCard } from '../../monster/services/model';

export type CombatState = {
  [monsterId: string]: MonsterAbilityCard[]
};
