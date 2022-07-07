import { Injectable } from '@angular/core';
import { createAdapter, createSelectors, Source } from '@state-adapt/core';
import { ElementNames, Elements, ElementState } from './model';
import { adapt } from '@state-adapt/angular';
import { CombatService } from '../combat/services/combat.service';

@Injectable({
  providedIn: 'root'
})
export class ElementService {
  public infuseElement$: Source<ElementNames> = new Source<ElementNames>('infuseElement$');
  public waneElement$: Source<ElementNames> = new Source<ElementNames>('waneElement$');
  public inertElement$: Source<ElementNames> = new Source<ElementNames>('inertElement$');

  private _elementAdapter = createAdapter<ElementState>()({
    infuseElement: (state, event, initialState) => ({
      ...state,
      [event]: {
        ...state[event],
        level: Math.min(2, ++state[event].level)
      }
    }),
    waneElement: (state, event, initialState) => ({
      ...state,
      [event]: {
        ...state[event],
        level: Math.max(0, --state[event].level)
      }
    }),
    selectors: createSelectors<ElementState>()({
      inertElements: s => Object.values(s).filter(e => e.level === 1),
      waningElements: s => Object.values(s).filter(e => e.level === 2),
      infusedElements: s => Object.values(s).filter(e => e.level === 3),
      elements: s => Object.values(s)
    })
  });

  public elementStore = adapt(
    'elements',
    Object.keys(Elements).reduce((prev, key) => {
      prev[key] = { name: key, level: 0 }
      return prev;
    }, {} as ElementState),
    this._elementAdapter,
    {
      waneElement: this.waneElement$,
      infuseElement: this.infuseElement$
    }
  )

  constructor(private _combatService: CombatService) {
  }


}
