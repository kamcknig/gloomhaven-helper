export const ConditionsAndEffects = [
  'AddTarget',
  'Advantage',
  'Bless',
  'Curse',
  'Disadvantage',
  'Disarm',
  'Immobilize',
  'Invisibility',
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
  'Invisibility',
  'Muddle',
  'Poison',
  'Retaliate',
  'Shield',
  'Strengthen',
  'Stun',
  'Wound'
]

export type ConditionAndEffectsType = typeof ConditionsAndEffects[number];

export interface Monster {
  name: string;
  id: number;
  health: [number, number][],
  attack?: [number, number][];
  conditionsAndEffects?: {
    [key in ConditionAndEffectsType]: ([number, number] | [[number, number], [number, number]])[];
  }
  elite?: boolean;
  flying?: [boolean, boolean][];
  move?: [number, number][];
  range?: [number, number][];
  retaliate?: [number, number][];
  target?: [number, number][];
  abilities: MonsterAbilityCard[];
  active?: boolean;
}

export type MonsterAbilityCard = {
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
