import { Inject, Injectable } from '@angular/core';
import { AdaptCommon, createAdapter, createSelectors, Source } from '@state-adapt/core';
import { MAX_LEVEL } from './scenario-options/max-level.token';

export interface ScenarioInfo {
  level: number;
}

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private _scenarioAdapter = createAdapter<ScenarioInfo>()({
    updateLevel: (state, event, initialState) => ({...state, level: Math.min(Math.max(typeof event === 'string' ? state.level + Number(event) : event, 0), this.maxLevel) }),
    selectors: createSelectors<ScenarioInfo>()({
      level: s => s.level
    })
  });

  scenarioLevel$ = new Source<number | string>('scenarioLevel$');

  scenarioStore = this.adapt.init(
    ['scenario', this._scenarioAdapter, { level: 0 }],
    {
      updateLevel: this.scenarioLevel$
    }
  )

  constructor(
    public adapt: AdaptCommon<any>,
    @Inject(MAX_LEVEL) public maxLevel: number
  ) { }
}
