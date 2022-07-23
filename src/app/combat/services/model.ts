import { MonsterAbilityCard } from '../../monster/services/model';

export interface TokenInfo {
  health?: number;
  maxHealth: number;
  number: number;
  monsterId: number | undefined;
  elite?: boolean;
  appliedConditionsAndEffects?: {
    [key: string]: number;
  }
}

export type CombatState = {
  round: number;
  tokens: TokenInfo[];
  activeMonsters: {
    [monsterId: number]: MonsterAbilityCard[];
  }
};
