import { Injectable } from '@angular/core';
import { AdaptCommon, createAdapter, createSelectors, getHttpSources, Source } from '@state-adapt/core';
import { HttpClient } from '@angular/common/http';

export enum ConditionsAndEffects {
  AddTarget = 'AddTarget',
  Bless = 'Bless',
  Curse = 'Curse',
  Disarm = 'Disarm',
  Immobilize = 'Immobilize',
  Invisibility = 'Invisibility',
  Muddle = 'Muddle',
  Pierce = 'Pierce',
  Poison = 'Poison',
  Pull = 'Pull',
  Push = 'Push',
  Retaliate = 'Retaliate',
  Shield = 'Shield',
  Strengthen = 'Strengthen',
  Stun = 'Stun',
  Wound = 'Wound',
}

export interface MonsterInfo {
  name: string;
  id: number;
  health: [number, number][],
  attack?: [number, number][];
  conditionsAndEffects?: {
    [key in keyof typeof ConditionsAndEffects]: [number, number][]
  }
  elite?: boolean;
  flying?: [boolean, boolean][];
  move?: [number, number][];
  range?: [number, number][];
  retaliate?: [number, number][];
  target?: [number, number][];
}

type MonsterNoId = Omit<MonsterInfo, 'id'>;

@Injectable({
  providedIn: 'root'
})
export class MonsterService {
  private static _idIncrementer: number = 0;

  activateMonster$: Source<MonsterInfo> = new Source('activateMonster$');

  private _activeMonsterAdapter = createAdapter<MonsterInfo[]>()({
    activateMonster: (state, event, initialState) => ([...state, event]),
    selectors: createSelectors<MonsterInfo[]>()({
      activeMonsters: s => s
    })
  });

  activeMonsterStore = this._adapt.init(
    ['activeMonsters', this._activeMonsterAdapter, []],
    {
      activateMonster: this.activateMonster$
    }
  )

  private _monsterAdapter = createAdapter<MonsterInfo[]>()({
    add: (state, event: MonsterNoId[] | MonsterNoId, initialState) =>
      [...state, ...(Array.isArray(event) ? event : [event]).map(e => ({ ...e, id: ++MonsterService._idIncrementer }) as MonsterInfo)],
    selectors: createSelectors<MonsterInfo[]>()({
      monsters: s => s
    })
  });

  private _GETMonstersSources$ = getHttpSources(
    '[GET Monsters]', this._http.get('assets/data/monsters.json'), (res: any) => {
      return [
        !!res,
        res.monsters,
        'fuck no'
      ]
    });

  monsterStore = this._adapt.init(
    ['monsters', this._monsterAdapter, []],
    {
      add: this._GETMonstersSources$.success$
    }
  );

  constructor(
    private _adapt: AdaptCommon<any>,
    private _http: HttpClient
  ) {
    this.monsterStore.monsters$.subscribe();
  }
}
