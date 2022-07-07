export enum Elements {
  Dark = 'Dark',
  Earth = 'Earth',
  Fire = 'Fire',
  Ice = 'Ice',
  Sun = 'Sun',
  Wind = 'Wind'
}

export type ElementNames = keyof typeof Elements

export type Element = {
  name: keyof typeof Elements;
  level: number;
}

export type ElementState = {
  [Property in ElementNames]: Element
}
