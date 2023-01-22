export type MonsterId = number | string;

export enum Conditions {
  bless = 'bless',
  curse = "curse",
  disarm = "disarm",
  immobilize = "immobilize",
  invisible = "invisible",
  muddle = "muddle",
  poison = "poison",
  strengthen = "strengthen",
  stun = "stun",
  wound = "wound"
}
export type ConditionNames = keyof typeof Conditions;

export const isCondition = (value: string): value is ConditionNames => {
  return Object.values(Conditions).includes(value as Conditions);
}

export enum AttackEffects {
  pull = 'pull',
  push = 'push',
  pierce = 'pierce',
  target = 'target'
}

export type AttackEffectNames = keyof typeof AttackEffects;

export const isAttackEffect = (value: string): value is AttackEffectNames => {
  return Object.values(AttackEffects).includes(value as AttackEffects);
}

export enum Bonuses {
  'shield' = 'shield',
  'retaliate' = "retaliate"
}

export type BonusNames = keyof typeof Bonuses;

export const isBonus = (value: string): value is BonusNames => {
  return Object.values(Bonuses).includes(value as Bonuses);
}

/**
 * These are the effects and conditions that can be applied to a monster.
 */
export const ApplicableConditions = [
  'disarm',
  'immobilize',
  'invisible',
  'muddle',
  'poison',
  'retaliate',
  'shield',
  'strengthen',
  'stun',
  'wound'
] as const;

/**
 * Represents the values of a stat for a monster. It represents the values at a particular level. The first number
 * of the tuple is the normal monster value, and the second in the tuple is the elite monster value
 */
export type Stat = [number, number];

export enum Attributes {
  'health' = "health",
  'move' = "move",
  'attack' = "attack",
  'range' = "range"
}
export type Attribute = keyof typeof Attributes;

export type Boss = Monster & { boss: true };

export const isBoss = (value: Monster): value is Boss => {
  return !!value && value.hasOwnProperty('boss') && value['boss'] === true;
}

export interface Monster {
  name: string;
  id: MonsterId;

  /**
   * Contains info on the attributes of {@link Monster}. The attributes are {@link Attribute}
   */
  attributes: {
    [k in Attribute]: Stat[];
  };

  /**
   * Contains info on the conditions a {@link Monster} has. The conditions are {@link ConditionNames}
   */
  conditions: {
    [key in ConditionNames]: Stat[];
  }

  /**
   * Contains info on the attack effects a {@link Monster} has. The attack effects are {@link AttackEffectNames}
   */
  attackEffects: {
    [key in AttackEffectNames]: Stat[];
  }

  /**
   * Contains info on the bonuses a monster has. The bonuses are {@link BonusNames}
   */
  bonuses: {
    [key in BonusNames]: (Stat | [Stat, Stat])[];
  }

  flying?: boolean;
  elite?: boolean;
  target?: [number, number][];
  abilities: MonsterAbility[];
  active?: boolean;

  // can be used as an override to the scenario level
  level?: number;
}

/**
 * Indicates a modifier that can be applied to a number. If it is a number, it is simply added to
 * the value. If it is a string it is parsed to indicate if the number in the string should be added to,
 * subtracted form, or if the value should be set to the given number.
 *
 * e.g. +5 means add five, -3 means subtract 3, =2 means set to 2. A number with no qualifier means add.
 */
export type StatModifier = number | string;

/**
 * Generic monster type
 */
export type Mob = Boss | Monster;

export type MoveModifierNames = 'jump' | 'flying';
export type ActionNames = ConditionNames | BonusNames | AttackEffectNames | 'attack' | 'move' | 'text';

// values can be
// StatModifier - range, maybe also target?
// string - text
// boolean - immobilize
// number - target maybe also StatModifier?
export type ActionModifier = {
  [p in (ConditionNames | BonusNames | AttackEffectNames | 'range' | 'text' | MoveModifierNames)]: any;
};

export type Action = {
  action: ActionNames;
  value?: StatModifier | string;
  modifiers: ActionModifier[];
}

/**
 * Represents a single round ability a monster has. These are the monster "cards".
 */
export type MonsterAbility = {
  initiative: number;
  shuffle?: boolean;
  imgName: string;
  count?: number;

  actions?: Action[];
}

export type MonsterNoId = Omit<Monster, 'id'>;

export type MonsterState = {
  [id: string]: Monster;
}
