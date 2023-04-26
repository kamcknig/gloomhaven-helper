import { Inject, Injectable } from '@angular/core';
import { createAdapter } from '@state-adapt/core';
import { MAX_LEVEL } from './scenario-options/max-level.token';
import { adapt } from '@state-adapt/angular';
import { CombatService } from './combat/services/combat.service';
import { ScenarioInfo, ViewMode } from './model';
import { MonsterService } from "./monster/services/monster.service";
import { joinStores, Source } from '@state-adapt/rxjs';
import {MonsterId} from "./monster/services/model";

@Injectable({
  providedIn: 'root'
})
export class AppService {
  public scenarioLevelUpdate$ = new Source<number | string>('scenarioLevelUpdate$');
  public toggleViewMode$ = new Source<void>('toggleViewMode$');

  private _scenarioAdapter = createAdapter<ScenarioInfo>()({
    scenarioLevelUpdate: (state, event) => ({
      ...state,
      level: Math.min(Math.max(typeof event === 'string' ? state.level + Number(event) : event, 0), this.maxLevel)
    }),
    toggleViewMode: (state) => ({ ...state, viewMode: state.viewMode === 'normal' ? 'list' : 'normal' }),
    selectors: {
      level: s => s.level,
      viewMode: s => s.viewMode
    }
  });

  scenarioStore = adapt(
    [
      'scenario',
      {
        level: 1,
        viewMode: 'normal' as ViewMode
      },
      this._scenarioAdapter
    ],
    {
      scenarioLevelUpdate: this.scenarioLevelUpdate$,
      toggleViewMode: this.toggleViewMode$
    }
  )

  public monsterLevel(monsterId: MonsterId) {
    return joinStores({
      one: this._monsterService.monsterStore,
      two: this.scenarioStore
    })({
      level: s => s.oneActiveMonsters.find(m => m.id === monsterId)?.level ?? s.twoLevel
    })();
  }

  constructor(
    @Inject(MAX_LEVEL) public maxLevel: number,
    private _combatService: CombatService,
    private _monsterService: MonsterService
  ) {
  }
}
