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
  abilities: { initiative: number, shuffle?: boolean, imgName: string, count?: number }[];
  active?: boolean;
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
    ['monsters', this._monsterAdapter, {
      // TODO: remove testing code
      '12345': {
        'active': true,
        'id': 12345,
        "name": "Ancient Artillery",
        "health": [
          [4, 7],
          [6, 9],
          [7, 11],
          [8, 13]
        ],
        "move": [
          [0, 0],
          [0, 0],
          [0, 0],
          [0, 0]
        ],
        "attack": [
          [2, 3],
          [2, 3],
          [2, 3],
          [3, 4]
        ],
        "range": [
          [4, 5],
          [4, 5],
          [5, 6],
          [5, 6]
        ],
        "conditionsAndEffects": {
          "AddTarget": [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0]
          ],
          "Advantage": [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0]
          ],
          "Bless": [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0]
          ],
          "Curse": [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0]
          ],
          "Disadvantage": [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0]
          ],
          "Disarm": [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0]
          ],
          "Immobilize": [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0]
          ],
          "Invisibility": [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0]
          ],
          "Muddle": [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0]
          ],
          "Pierce": [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0]
          ],
          "Poison": [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0]
          ],
          "Pull": [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0]
          ],
          "Push": [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0]
          ],
          "Retaliate": [
            [[0, 0], [0, 0]],
            [[0, 0], [0, 0]],
            [[0, 0], [0, 0]],
            [[0, 0], [0, 0]]
          ],
          "Shield": [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0]
          ],
          "Strengthen": [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0]
          ],
          "Stun": [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0]
          ],
          "Wound": [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0]
          ]
        },
        "flying": [
          [false, false],
          [false, false],
          [false, false],
          [false, false]
        ],
        "target": [
          [0, 0],
          [0, 0],
          [0, 0],
          [0, 0]
        ],
        "abilities": [
          {
            "initiative": 46,
            "imgName": "ancient-artillery-attack-card-1"
          },
          {
            "initiative": 37,
            "imgName": "ancient-artillery-attack-card-2"
          },
          {
            "initiative": 95,
            "imgName": "ancient-artillery-attack-card-3"
          },
          {
            "initiative": 71,
            "imgName": "ancient-artillery-attack-card-4",
            "count": 2,
            "shuffle": true
          },
          {
            "initiative": 17,
            "imgName": "ancient-artillery-attack-card-5"
          },
          {
            "initiative": 37,
            "imgName": "ancient-artillery-attack-card-6"
          },
          {
            "initiative": 46,
            "imgName": "ancient-artillery-attack-card-7"
          }
        ]
      }
    }],
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
