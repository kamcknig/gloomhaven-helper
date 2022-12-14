import { Injectable } from '@angular/core';
import { createAdapter } from '@state-adapt/core';
import { Element, ElementNames, ElementPhases, Elements, ElementState } from './model';
import { adapt } from '@state-adapt/angular';
import { CombatService } from '../combat/services/combat.service';
import { Source } from '@state-adapt/rxjs';

@Injectable({
  providedIn: 'root'
})
export class ElementService {
  public cycleElement$: Source<ElementNames> = new Source<ElementNames>('cycleElement$');

  private _elementAdapter = createAdapter<ElementState>()({
    cycleElement: (state, event) => {
      const element: Element = state[event.toLowerCase()];
      if (element.level === ElementPhases.off) {
        element.level = ElementPhases.infused;
      } else {
        Math.max(ElementPhases.off, --element.level)
      }

      return {
        ...state,
        [event]: {
          ...element
        }
      }
    },
    roundComplete: (state) => Object.entries(state)
      .reduce((prev, [id, element]) => {
        prev[id] = {
          ...element,
          level: Math.max(0, --state[id].level)
        }
        return prev;
      }, {} as ElementState),
    selectors: {
      inertElements: s => Object.values(s)
        .filter(e => e.level === 1),
      waningElements: s => Object.values(s)
        .filter(e => e.level === 2),
      infusedElements: s => Object.values(s)
        .filter(e => e.level === 3),
      elements: s => Object.values(s)
    }
  });

  public elementStore = adapt(
    [
      'elements',
      Object.keys(Elements)
        .reduce((prev, key) => {
          prev[key.toLowerCase()] = { name: key, level: 0 }
          return prev;
        }, {} as ElementState),
      this._elementAdapter
    ],
    {
      cycleElement: this.cycleElement$,
      roundComplete: this._combatService.roundComplete$
    }
  )

  constructor(private _combatService: CombatService) {
  }
}
