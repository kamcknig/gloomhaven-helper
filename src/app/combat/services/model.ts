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
  /**
   * A dictionary of monsterId: {@link MonsterAbilityCard}[]
   */
  activeMonsters: {
    [monsterId: number]: MonsterAbilityCard[];
  }
};
