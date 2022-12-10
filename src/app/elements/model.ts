export enum Elements {
  Dark = 'dark',
  Earth = 'earth',
  Fire = 'fire',
  Ice = 'ice',
  Sun = 'sun',
  Wind = 'wind'
}

export type ElementNames = keyof typeof Elements

export type Element = {
  name: keyof typeof Elements;
  level: number;
}

export type ElementState = {
  [Property in ElementNames]: Element
}

export enum ElementPhases {
  off,
  waning,
  infused
}
