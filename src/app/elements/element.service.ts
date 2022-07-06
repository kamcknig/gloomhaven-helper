import { Injectable } from '@angular/core';
import { AdaptCommon, createAdapter, createSelectors, Source } from '@state-adapt/core';

export enum Elements {
  Dark = 'Dark',
  Earth = 'Earth',
  Fire = 'Fire',
  Ice = 'Ice',
  Sun = 'Sun',
  Wind = 'Wind'
}

export type ElementInfo = keyof typeof Elements;

export interface ElementState {
  infused: ElementInfo[],
  waning: ElementInfo[],
  inert: ElementInfo[]
}

@Injectable({
  providedIn: 'root'
})
export class ElementService {
  public infuseElement$: Source<ElementInfo> = new Source<ElementInfo>('infuseElement$');
  public waneElement$: Source<ElementInfo> = new Source<ElementInfo>('waneElement$');
  public inertElement$: Source<ElementInfo> = new Source<ElementInfo>('inertElement$');

  private _elementAdapter = createAdapter<ElementState>()({
    infuseElement: (state, event, initialState) => ({
      ...state,
      infused: [
        ...state.infused.filter(e => e !== event)
          .concat(event)
      ],
      inert: [
        ...state.inert.filter(e => e !== event)
      ],
      waning: [
        ...state.waning.filter(e => e !== event)
      ]
    }),
    waneElement: (state, event, initialState) => ({
      ...state,
      infused: [
        ...state.infused.filter(e => e !== event)
      ],
      inert: [
        ...state.inert.filter(e => e !== event)
      ],
      waning: [
        ...state.waning.filter(e => e !== event)
          .concat(event)
      ]
    }),
    inertElement: (state, event, initialState) => ({
      ...state,
      infused: [
        ...state.infused.filter(e => e !== event)
      ],
      inert: [
        ...state.inert.filter(e => e !== event)
          .concat(event)
      ],
      waning: [
        ...state.waning.filter(e => e !== event)
      ]
    }),
    selectors: createSelectors<ElementState>()({
      inertElements: s => s.inert,
      waningElements: s => s.waning,
      infusedElements: s => s.infused
    })
  });

  public elementStore = this._adapt.init(
    [
      'elements',
      {
        infused: [],
        inert: Object.keys(Elements)
          .filter(key => Elements[key]) as ElementInfo[],
        waning: []
      },
      this._elementAdapter
    ],
    {
      inertElement: this.inertElement$,
      waneElement: this.waneElement$,
      infuseElement: this.infuseElement$
    }
  )

  constructor(
    private _adapt: AdaptCommon<any>
  ) {
  }


}
