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
