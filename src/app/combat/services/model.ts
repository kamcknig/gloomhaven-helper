import {MonsterAbility, MonsterId} from '../../monster/services/model';

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
  actions: MonsterAbility['actions'];

  round: number

  turn: number;

  tokens: TokenInfo[];

  activeMonsters: {
    [monsterId: number | string]: {
      id: MonsterId;
      boss?: boolean;
      name: string;
      abilities: MonsterAbility[];
      initiative?: number | undefined;
      // 0-indexed number that indicates which card in the {@link abilities} Array is drawn
      card?: number;
    };
  }
};
