export const Conditions = [
  'bless', 'curse', 'disarm',
  'immobilize', 'invisible', 'muddle',
  'poison', 'strengthen', 'stun',
  'wound'
] as const;
export type Condition = typeof Conditions[number];
export const isCondition = (value: string): value is Condition => {
  return Conditions.includes(value as Condition);
}

export const AttackEffects = ['pull', 'push', 'pierce', 'target'] as const;
export type AttackEffect = typeof AttackEffects[number];
export const isAttackEffect = (value: string): value is AttackEffect => {
  return AttackEffects.includes(value as AttackEffect);
}

export const Bonuses = ['shield', 'retaliate'] as const;
export type Bonus = typeof Bonuses[number];
export const isBonus = (value: string): value is Bonus => {
  return Bonuses.includes(value as Bonus);
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

export type Stat = [number, number];

export const Attributes = ['health', 'move', 'attack', 'range'] as const;
export type Attribute = typeof Attributes[number];

export interface Monster {
  name: string;
  id: number;

  /**
   * Contains info on the attributes of {@link Monster}. The attributes are {@link Attribute}
   */
  attributes: {
    [k in Attribute]: Stat[];
  };

  /**
   * Contains info on the conditions a {@link Monster} has. The conditions are {@link Condition}
   */
  conditions: {
    [key in Condition]: Stat[];
  }

  /**
   * Contains info on the attack effects a {@link Monster} has. The attack effects are {@link AttackEffect}
   */
  attackEffects: {
    [key in AttackEffect]: Stat[];
  }

  /**
   * Contains info on the bonuses a monster has. The bonuses are {@link Bonus}
   */
  bonuses: {
    [key in Bonus]: (Stat | [Stat, Stat])[];
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
 * Represents a single round ability a monster has. These are the monster "cards".
 */
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
