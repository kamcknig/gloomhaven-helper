import { Inject, Injectable } from '@angular/core';
import { AdaptCommon, createAdapter, createSelectors, Source } from '@state-adapt/core';
import { MAX_LEVEL } from './scenario-options/max-level.token';

export interface ScenarioInfo {
  level: number;
  round: number;
}

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private _scenarioAdapter = createAdapter<ScenarioInfo>()({
    updateLevel: (state, event, initialState) => ({ ...state, level: Math.min(Math.max(typeof event === 'string' ? state.level + Number(event) : event, 0), this.maxLevel) }),
    updateRound: (state, event, initialState) => ({ ...state, round: event }),
    selectors: createSelectors<ScenarioInfo>()({
      level: s => s.level,
      round: s => s.round
    })
  });

  updateScenarioLevel$ = new Source<number | string>('updateScenarioLevel$');
  updateRound$ = new Source<number | string>('updateRound$');

  scenarioStore = this.adapt.init(
    ['scenario', this._scenarioAdapter, { level: 0, round: 0 }],
    {
      updateLevel: this.updateScenarioLevel$,
      updateRound: this.updateRound$
    }
  )

  constructor(
    public adapt: AdaptCommon<any>,
    @Inject(MAX_LEVEL) public maxLevel: number
  ) { }
}
