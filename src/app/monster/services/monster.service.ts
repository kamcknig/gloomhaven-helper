import { Injectable } from '@angular/core';
import { createAdapter } from '@state-adapt/core';
import { HttpClient } from '@angular/common/http';
import {
  ActivateMonsterDialogComponent
} from '../components/activate-monster-dialog/activate-monster-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { filter, map, share, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { adapt } from '@state-adapt/angular';
import { Monster, MonsterNoId, MonsterState } from './model';
import {
  SelectMonsterLevelOverrideComponent
} from "../components/select-monster-level-ovrerride/select-monster-level-override.component";
import { Source, toSource } from '@state-adapt/rxjs';

@Injectable({
  providedIn: 'root'
})
export class MonsterService {
  private static _idIncrementer: number = 0;

  public monsterAdapter = createAdapter<MonsterState>()({
    add: (state, event: MonsterNoId[] | MonsterNoId) => ({
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
    deactivateMonster: (state, monster: Monster) => ({
      ...state,
      [monster.id]: {
        ...state[monster.id],
        active: false
      }
    }),
    activateMonster: (state, event) => ({
      ...state,
      [event.id]: {
        ...state[event.id],
        active: true
      }
    }),
    overrideLevel: (state, event) => ({
      ...state,
      [event.monsterId]: {
        ...state[event.monsterId],
        level: event.level
      }
    }),
    selectors: {
      monsters: s => Object.values(s),
      activeMonsters: s => Object.values(s)
        .filter(m => !!m.active),
      inactiveMonsters: s => Object.values(s)
        .filter(m => !m.active)
    }
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

  public deactivateMonster$: Source<Monster> = new Source('deactivateMonster$')

  // trigger draw action, pass monster ID
  public monsterAbilityCardDraw$: Source<number> = new Source('drawAbilityCard$');

  public overrideMonsterLevel$: Source<{ monsterId: number; level: number }> = new Source('overrideMonsterLevel$');

  public monsterStore = adapt(
    [
      'monsters',
      {},
      this.monsterAdapter
    ],
    {
      add: this._monsterGet as Observable<any>,
      activateMonster: this.activateMonster$,
      deactivateMonster: this.deactivateMonster$,
      overrideLevel: this.overrideMonsterLevel$
    }
  );

  public overrideMonsterLevel(monsterId: number): void {
    this._dialogService.open(SelectMonsterLevelOverrideComponent, { data: { monsterId } })
      .afterClosed()
      .pipe(
        filter(v => v !== undefined),
        map(result => ({
          monsterId,
          level: result
        }))
      )
      .subscribe({
        next: value => this.overrideMonsterLevel$.next(value)
      });
  }

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
    private _http: HttpClient
  ) {
    this.monsterStore.monsters$.subscribe();
  }
}
