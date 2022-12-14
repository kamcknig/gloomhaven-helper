export enum Elements {
  dark = 'dark',
  earth = 'earth',
  fire = 'fire',
  ice = 'ice',
  sun = 'sun',
  wind = 'wind'
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
