import { Injectable } from '@angular/core';
import { createAdapter, createSelectors, Source } from '@state-adapt/core';
import { ElementNames, ElementPhases, Elements, ElementState } from './model';
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
        queued: true
      }
    }),
    waneElement: (state, event, initialState) => ({
      ...state,
      [event]: {
        ...state[event],
        level: Math.max(0, --state[event].level)
      }
    }),
    roundComplete: (state) => Object.entries(state).reduce((prev, [id, element]) => {
      prev[id] = {
        ...element,
        level: state[id].queued ? ElementPhases.infused : Math.max(0, --state[id].level),
        queued: false
      }
      return prev;
    }, {} as ElementState),
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
      infuseElement: this.infuseElement$,
      roundComplete: this._combatService.roundComplete$
    }
  )

  constructor(private _combatService: CombatService) {
  }


}
