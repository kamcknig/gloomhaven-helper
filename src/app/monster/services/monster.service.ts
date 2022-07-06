import { Injectable } from '@angular/core';
import { AdaptCommon, createAdapter, createSelectors, Source, toSource } from '@state-adapt/core';
import { HttpClient } from '@angular/common/http';
import { ActivateMonsterDialogComponent } from '../activate-monster-dialog/activate-monster-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { filter, map, share, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';

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
  abilities: MonsterAbilityCard[];
  active?: boolean;
}

export type MonsterAbilityCard = {
  initiative: number,
  shuffle?: boolean,
  imgName: string,
  count?: number,
  drawn?: boolean;
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

  public monsterAdapter = createAdapter<MonsterState>()({
    add: (state, event: MonsterNoId[] | MonsterNoId, initialState) => ({
      ...state,
      ...(Array.isArray(event) ? event : [event]).reduce((prev, next) => {
        const id = ++MonsterService._idIncrementer;
        prev[id] = {
          ...next,
          id
        }
        return prev;
      }, {})
    }),
    activateMonster: (state, event, initialState) => ({
      ...state,
      [event.id]: {
        ...state[event.id],
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
      share(),
      toSource('[GET Monsters]')
    );

  //------ sources

  // trigger activate monster action, pass Monster instance
  public activateMonster$: Source<Monster> = new Source('activateMonster$');

  // trigger draw action, pass monster ID
  public drawAbilityCard$: Source<number> = new Source('drawAbilityCard$');

  public monsterStore = this._adapt.init((
    ['monsters', {}, this.monsterAdapter],
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
              tap(monster => this.activateMonster$.next(monster))
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
