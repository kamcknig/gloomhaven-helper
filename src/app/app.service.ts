import { Inject, Injectable } from '@angular/core';
import { AdaptCommon, createAdapter, createSelectors, Source } from '@state-adapt/core';
import { MAX_LEVEL } from './scenario-options/max-level.token';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private _scenarioAdapter = createAdapter<{ level: number }>()({
    updateLevel: (state, event, initialState) => ({...state, level: Math.min(event, this.maxLevel) }),
    selectors: createSelectors<{ level: number }>()({
      level: s => s.level
    })
  });

  scenarioLevel$ = new Source<number>('scenario$');

  scenarioStore = this.adapt.init(
    ['scenario', this._scenarioAdapter, { level: 0 }],
    {
      updateLevel: this.scenarioLevel$
    }
  )

  constructor(
    public adapt: AdaptCommon<any>,
    @Inject(MAX_LEVEL) public maxLevel: number
  ) {    this.scenarioStore.level$
  }
}
