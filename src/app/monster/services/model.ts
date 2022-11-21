import { ElementNames } from '../../elements/model';

export const ConditionsAndEffects = [
  'Target',
  'Advantage',
  'Bless',
  'Curse',
  'Disadvantage',
  'Disarm',
  'Immobilize',
  'Invisible',
  'Muddle',
  'Pierce',
  'Poison',
  'Pull',
  'Push',
  'Retaliate',
  'Shield',
  'Strengthen',
  'Stun',
  'Wound'
] as const;

/**
 * These are the effects and conditions that can be applied to a monster or a character
 */
export const ApplicableConditions = [
  'Disarm',
  'Immobilize',
  'Invisible',
  'Muddle',
  'Poison',
  'Retaliate',
  'Shield',
  'Strengthen',
  'Stun',
  'Wound'
]

export type ConditionAndEffectTypes = typeof ConditionsAndEffects[number];

export type Attribute = [number, number][];

export interface Monster {
  name: string;
  id: number;

  attributes: {
    health: Attribute,
    attack?: Attribute;
    move?: Attribute;
    range?: Attribute;
  };

  conditionsAndEffects?: {
    [key in ConditionAndEffectTypes]: (boolean | [number, number] | [[number, number], [number, number]])[];
  }
  flying?: boolean;
  elite?: boolean;
  retaliate?: [number, number][];
  target?: [number, number][];
  abilities: MonsterAbility[];
  active?: boolean;
  infusions?: Lowercase<ElementNames>[];

  // can be used as an override to the scenario level
  level?: number;
}

export type MonsterAbility = {
  initiative: number,
  shuffle?: boolean,
  imgName: string,
  count?: number,
  drawn?: boolean;
}

export type MonsterNoId = Omit<Monster, 'id'>;

export type MonsterState = {
  [id: string]: Monster;
}
