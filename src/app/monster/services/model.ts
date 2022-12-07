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
export type Condition = keyof typeof Conditions;
export const isCondition = (value: string): value is Condition => {
  return Object.values(Conditions).includes(value as Conditions);
}

export enum AttackEffects {
  pull = 'pull',
  push = "push",
  pierce = "pierce",
  target = "target"
}
export type AttackEffect = keyof typeof AttackEffects;
export const isAttackEffect = (value: string): value is AttackEffect => {
  return Object.values(AttackEffects).includes(value as AttackEffects);
}

export enum Bonuses {
  'shield' = 'shield',
  'retaliate' = "retaliate"
}
export type Bonus = keyof typeof Bonuses;
export const isBonus = (value: string): value is Bonus => {
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

export type Mob = Boss | Monster;

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
