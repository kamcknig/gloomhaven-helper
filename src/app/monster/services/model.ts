import {ElementNames} from "../../elements/model";

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

/**
 * Indicates a modifier that can be applied to a number. If it is a number, it is simply added to
 * the value. If it is a string it is parsed to indicate if the number in the string should be added to,
 * subtracted form, or if the value should be set to the given number.
 *
 * e.g. +5 means add five, -3 means subtract 3, =2 means set to 2. A number with no qualifier means add.
 */
export type StatModifier = number | string;

export type Mob = Boss | Monster;

export type MobAction = {
  /**
   * Indicates the {@link StatModifier} that modifies the {@link MobAction}s attack power
   */
  attack?: StatModifier;

  /**
   * Indicates the {@link MobAction} should apply {@link Condition.bless}
   */
  // todo: might change to a [number, number] or [boolean, number]?
  bless?: boolean;

  /**
   * Indicates the {@link MobAction} applies {@link Condition.curse} to the target
   */
  curse?: boolean;

  /**
   * Indicates that the {@link MobAction} applies {@link Condition.immobilize}
   */
  immobilize?: boolean;

  /**
   * Indicates that the {@link MobAction} provides jump for any movement
   */
  jump?:boolean;

  /**
   * Indicates that the {@link MobAction} applies a heal effect to the target and at what range if any
   */
  heal?: [number, number];

  /**
   * Any text on the card that might modify the {@link MobAction}
   */
  'info-text': string;

  /**
   * Indicates which elements the {@link MobAction} infuses during the turn
   */
  infuse?: ElementNames[];

  /**
   * Indicates a loot {@link MobAction}
   */
  loot?: boolean;

  /**
   * Indicates the number of hexes to modify the {@link MobAction} movement value
   */
  move?: StatModifier;

  /**
   * Indicates that the {@link MobAction} applies {@link Condition.muddle} to the target
   */
  muddle?: boolean;

  /**
   * Indicates the number amount of shield a {@link MobAction}s ignores
   */
  pierce?: number;

  /**
   * Indicates the number of hexes the {@link MobAction}s targets are pulled
   */
  pull?: StatModifier;

  /**
   * Indicates the number of hexes the {@link MobAction}s targets are pushed
   */
  push?: StatModifier;

  /**
   * Indicates the {@link StatModifier} that modifies the {@link MobAction}s range
   */
  range?: StatModifier;

  /**
   * Indicates the {@link MobAction} imbues the {@link Mob} with {@link Bonus.retaliate} and the range
   * at which it applies
   */
  retaliate?: [StatModifier, number];

  /**
   * Indicates the shield value the {@link MobAction} adds to the attacker
   */
  shield?: StatModifier;

  /**
   * Indicates that the {@link MobAction} applies {@link Bonus.shield}
   */
  strengthen?: boolean;

  /**
   * Indicates the {@link MobAction} is a boss special action
   */
  special: 1 | 2;

  /**
   * Indicates the {@link StatModifier} that modifies the {@link MobAction}s number of targets
   */
  target?: StatModifier;

  /**
   * Indicates the {@link MobAction} applies {@link Condition.wound} to the target
   */
  wound?: boolean;
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

  actions?: MobAction[]
}

export type MonsterNoId = Omit<Monster, 'id'>;

export type MonsterState = {
  [id: string]: Monster;
}
