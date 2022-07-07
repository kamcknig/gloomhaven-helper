import { Injectable } from '@angular/core';
import { createAdapter, createSelectors, Source, toSource } from '@state-adapt/core';
import { HttpClient } from '@angular/common/http';
import { ActivateMonsterDialogComponent } from '../activate-monster-dialog/activate-monster-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { filter, map, share, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { adapt } from '@state-adapt/angular';
import { Monster, MonsterNoId, MonsterState } from './model';

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
  public monsterActivate$: Source<Monster> = new Source('activateMonster$');

  // trigger draw action, pass monster ID
  public monsterAbilityCardDraw$: Source<number> = new Source('drawAbilityCard$');

  public monsterStore = adapt(
    'monsters',
    {},
    this.monsterAdapter,
    {
      add: this._monsterGet,
      activateMonster: this.monsterActivate$
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
              tap(monster => this.monsterActivate$.next(monster))
            )
          : of(null))
      );
  }

  constructor(
    private _dialogService: MatDialog,
    private _http: HttpClient
  ) {
    this.monsterStore.monsters$.subscribe();
  }
}
