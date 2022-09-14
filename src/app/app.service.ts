import { Inject, Injectable } from '@angular/core';
import {createAdapter, joinSelectors, Source} from '@state-adapt/core';
import { MAX_LEVEL } from './scenario-options/max-level.token';
import { adapt } from '@state-adapt/angular';
import { CombatService } from './combat/services/combat.service';
import { ScenarioInfo } from './model';
import {MonsterService} from "./monster/services/monster.service";

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
    selectors: {
      level: s => s.level
    }
  });

  scenarioStore = adapt(
    'scenario',
    {
      level: 1
    },
    this._scenarioAdapter,
    {
      scenarioLevelUpdate: this.scenarioLevelUpdate$
    }
  )

  public monsterLevel(monsterId: number) {
    return joinSelectors(
      [this._monsterService.monsterStore, 'activeMonsters'],
      [this.scenarioStore, 'level'],
      (monsters, scenarioLevel) => monsters.find(m => m.id === monsterId)?.level ?? scenarioLevel
    ).state$;
  }

  constructor(
    @Inject(MAX_LEVEL) public maxLevel: number,
    private _combatService: CombatService,
    private _monsterService: MonsterService
  ) {
  }
}
