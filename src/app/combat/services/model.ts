import {MonsterAbility} from '../../monster/services/model';

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
  round: number
  turn: number;
  tokens: TokenInfo[];
  activeMonsters: {
    [monsterId: number | string]: {
      boss?: boolean;
      name: string;
      abilities: MonsterAbility[];
      initiative?: number | undefined;
    };
  }
};
