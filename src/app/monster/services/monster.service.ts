import { Injectable } from '@angular/core';
import { AdaptCommon, createAdapter, createSelectors, joinSelectors, Source, toSource } from '@state-adapt/core';
import { HttpClient } from '@angular/common/http';
import { ActivateMonsterDialogComponent } from '../activate-monster-dialog/activate-monster-dialog.component';
import { filter, map, of, share, switchMap, take, tap, withLatestFrom } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

export const ConditionsAndEffects = [
  'AddTarget',
  'Advantage',
  'Bless',
  'Curse',
  'Disadvantage',
  'Disarm',
  'Immobilize',
  'Invisibility',
  'Muddle',
  'Pierce',
  'Poison',
  'Pull',
  'Push',
  'Retaliate',
  'Shield',
  'Strengthen',
  'Stun',
  'Wound'
] as const;

/**
 * These are the effects and conditions that can be applied to a monster or a character
 */
export const ApplicableConditions = [
  'Disarm',
  'Immobilize',
  'Invisibility',
  'Muddle',
  'Poison',
  'Retaliate',
  'Shield',
  'Strengthen',
  'Stun',
  'Wound'
]

export type ConditionAndEffectsType = typeof ConditionsAndEffects[number];

export interface MonsterInfo {
  name: string;
  id: number;
  health: [number, number][],
  attack?: [number, number][];
  conditionsAndEffects?: {
    [key in ConditionAndEffectsType]: ([number, number] | [[number, number], [number, number]])[];
  }
  elite?: boolean;
  flying?: [boolean, boolean][];
  move?: [number, number][];
  range?: [number, number][];
  retaliate?: [number, number][];
  target?: [number, number][];
  abilityCards: { initiative: number, imgPath: string }[];
}

type MonsterNoId = Omit<MonsterInfo, 'id'>;

@Injectable({
  providedIn: 'root'
})
export class MonsterService {
  private static _idIncrementer: number = 0;

  public activateMonster$: Source<MonsterInfo> = new Source('activateMonster$');

  private _activeMonsterAdapter = createAdapter<MonsterInfo[]>()({
    activateMonster: (state, event, initialState) => ([...state, event]),
    selectors: createSelectors<MonsterInfo[]>()({
      activeMonsters: s => s
    })
  });

  public activeMonsterStore = this._adapt.init(
    ['activeMonsters', this._activeMonsterAdapter, []],
    {
      activateMonster: this.activateMonster$
    }
  )

  private _monsterAdapter = createAdapter<MonsterInfo[]>()({
    add: (state, event: MonsterNoId[] | MonsterNoId, initialState) =>
      [...state, ...(Array.isArray(event) ? event : [event]).map(
        e => ({
          ...e,
          id: ++MonsterService._idIncrementer,
          abilityCards: new Array(7).fill(0).map((e, idx) => ({
            initiative: 5 + Math.floor(Math.random() * 30),
            imgPath: ''
          }))
        }) as MonsterInfo)],
    selectors: createSelectors<MonsterInfo[]>()({
      monsters: s => s
    })
  });

  // request to retrieve the monsters.json file
  private _monsterGet = this._http.get('assets/data/monsters.json')
    .pipe(
      map(res => res['monsters']),
      toSource('[GET Monsters]'),
      share()
    );

  monsterStore = this._adapt.init(
    ['monsters', this._monsterAdapter, []],
    {
      add: this._monsterGet
    }
  );

  public selectMonsterToActivate() {
    return joinSelectors(
      this.monsterStore,
      this.activeMonsterStore,
      (monsters, activeMonsters) => monsters.reduce(
        (prev, next) => activeMonsters.find(a => a.id === next.id) ? prev : prev.concat(next), [] as MonsterInfo [])
    )
      .state$
      .pipe(
        take(1),
        switchMap(monsters => monsters.length
          ? this._dialogService.open<ActivateMonsterDialogComponent, MonsterInfo[]>(
            ActivateMonsterDialogComponent, {
              disableClose: false,
              autoFocus: false,
              data: monsters
            })
            .afterClosed()
            .pipe(
              withLatestFrom(this.monsterStore.monsters$),
              map(([id, monsters]) => monsters.find(m => m.id === id)),
              filter(monster => !!monster),
              tap(monster => this.activateMonster$.next(monster))
            )
          : of(null)
        )
      );
  }

  constructor(
    private _dialogService: MatDialog,
    private _adapt: AdaptCommon<any>,
    private _http: HttpClient
  ) {
    this.monsterStore.monsters$.subscribe();
  }
}
