import { Injectable } from '@angular/core';
import { AdaptCommon, createAdapter, createSelectors, getHttpSources, Source } from '@state-adapt/core';
import { HttpClient } from '@angular/common/http';
import { ActivateMonsterDialogComponent } from '../activate-monster-dialog/activate-monster-dialog.component';
import { map, take } from 'rxjs';
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
        e => ({ ...e, id: ++MonsterService._idIncrementer }) as MonsterInfo)],
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

  public activateMonster(...args: any[]): void {
    this._dialogService.open(ActivateMonsterDialogComponent, {
      disableClose: false,
      autoFocus: false
    })
      .afterClosed()
      .subscribe({
        next: id => {
          let monster: MonsterInfo | undefined;
          this.monsterStore.monsters$
            .pipe(
              map(monsters => monsters.find(m => m.id === id)),
              take(1)
            )
            .subscribe({
              next: (value) => monster = value
            });

          if (!monster) {
            return;
          }
          this.activateMonster$.next(monster);
        }
      });
  }

  constructor(
    private _dialogService: MatDialog,
    private _adapt: AdaptCommon<any>,
    private _http: HttpClient
  ) {
    this.monsterStore.monsters$.subscribe();
  }
}
