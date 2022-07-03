import { Injectable } from '@angular/core';
import { AdaptCommon, createAdapter, createSelectors, Source, toSource } from '@state-adapt/core';
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

export interface Monster {
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
  abilityCards: { initiative: number, shuffle: boolean, imgPath: string }[];
  active: boolean;
}

type MonsterNoId = Omit<Monster, 'id'>;

type MonsterState = {
  [id: string]: Monster;
}

@Injectable({
  providedIn: 'root'
})
export class MonsterService {
  private static _idIncrementer: number = 0;

  private _monsterAdapter = createAdapter<MonsterState>()({
    add: (state, event: MonsterNoId[] | MonsterNoId, initialState) => ({
      ...state,
      ...(Array.isArray(event) ? event : [event]).reduce((prev, next) => {
        const id = ++MonsterService._idIncrementer;
        prev[id] = {
          ...next,
          id,
          abilityCards: new Array(7).fill(0)
            .map((e, idx) => ({
              initiative: 5 + Math.floor(Math.random() * 30),
              imgPath: ''
            }))
        }
        return prev;
      }, {})
    }),
    activateMonster: (state, event, initialState) => ({
      ...state,
      [event]: {
        ...state[event],
        active: true
      }
    }),
    selectors: createSelectors<MonsterState>()({
      monsters: s => Object.values(s),
      activeMonsters: s => Object.values(s)
        .filter(m => !!m.active),
      inactiveMonsters: s => Object.values(s)
        .filter(m => !m.active)
    })
  });

  // request to retrieve the monsters.json file
  private _monsterGet = this._http.get('assets/data/monsters.json')
    .pipe(
      map(res => res['monsters']),
      toSource('[GET Monsters]'),
      share()
    );

  public activateMonster$: Source<number> = new Source('activateMonster$');

  public monsterStore = this._adapt.init(
    ['monsters', this._monsterAdapter, {}],
    {
      add: this._monsterGet,
      activateMonster: this.activateMonster$
    }
  );

  public selectMonsterToActivate() {
    return this.monsterStore.inactiveMonsters$
      .pipe(
        take(1),
        switchMap(monsters => monsters.length
          ? this._dialogService.open <ActivateMonsterDialogComponent, Monster[]>(ActivateMonsterDialogComponent, {
              disableClose: false,
              autoFocus: false,
              data: monsters
            }
          )
            .afterClosed()
            .pipe(
              withLatestFrom(this.monsterStore.monsters$),
              map(([id, monsters]) => monsters.find(m => m.id === id)),
              filter(monster => !!monster),
              tap(monster => this.activateMonster$.next(monster.id))
            )
          : of(null))
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
