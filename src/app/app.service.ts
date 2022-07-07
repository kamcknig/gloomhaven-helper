import { Inject, Injectable } from '@angular/core';
import { createAdapter, createSelectors, Source } from '@state-adapt/core';
import { MAX_LEVEL } from './scenario-options/max-level.token';
import { adapt } from '@state-adapt/angular';
import { CombatService } from './combat/services/combat.service';
import { ScenarioInfo } from './model';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  public scenarioLevelUpdate$ = new Source<number | string>('scenarioLevelUpdate$');

  private _scenarioAdapter = createAdapter<ScenarioInfo>()({
    scenarioLevelUpdate: (state, event) => ({
      ...state,
      level: Math.min(Math.max(typeof event === 'string' ? state.level + Number(event) : event, 0), this.maxLevel)
    }),
    roundCompleted: (state) => ({ ...state, round: ++state.round }),
    selectors: createSelectors<ScenarioInfo>()({
      level: s => s.level,
      round: s => s.round
    })
  });

  scenarioStore = adapt(
    'scenario',
    {
      level: 0,
      round: 0
    },
    this._scenarioAdapter,
    {
      scenarioLevelUpdate: this.scenarioLevelUpdate$,
      roundCompleted: this._combatService.roundComplete$
    }
  )

  constructor(
    @Inject(MAX_LEVEL) public maxLevel: number,
    private _combatService: CombatService
  ) {
  }
}
