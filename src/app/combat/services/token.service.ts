import { Injectable } from '@angular/core';
import { AddTokenDialogComponent } from '../../monster/components/add-token-dialog/add-token-dialog.component';
import { switchMap, withLatestFrom } from 'rxjs/operators';
import { Monster } from '../../monster/services/model';
import { TokenInfo } from './model';
import { MatDialog } from '@angular/material/dialog';
import { AppService } from '../../app.service';
import { CombatService } from './combat.service';
import { Observable, Subject } from 'rxjs';
import { MonsterService } from '../../monster/services/monster.service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  public addToken$: Subject<number> = new Subject<number>();

  constructor(
    private _monsterService: MonsterService,
    private _dialogService: MatDialog,
    private _appService: AppService,
    private _combatService: CombatService
  ) {
    this.addToken$.pipe(
      withLatestFrom(
        this._monsterService.monsterStore.activeMonsters$,
        this._combatService.store.tokens$
      ),
      switchMap(([monsterId, monsters, tokens]) => {
        const monster = monsters.find(m => m.id === monsterId);
        const monsterTokens = tokens.filter(t => t.monsterId === monsterId);

        return this._dialogService.open(AddTokenDialogComponent, {
          data: tokens,
          disableClose: false,
          width: '20rem'
        })
          .afterClosed();
      })
    ).subscribe({
      next: ([monsterId, monsters, tokens]) => {


        this._combatService.addToken$.next({} as TokenInfo);
      }
    });
  }

  addToken(monster: Observable<Monster>, tokens: { elites: TokenInfo[], normals: TokenInfo[] } | undefined) {
    this._dialogService.open(AddTokenDialogComponent, {
      data: tokens,
      disableClose: false,
      width: '20rem'
    })
      .afterClosed()
      .pipe(
        withLatestFrom(
          this._appService.scenarioStore.level$,
          monster
        )
      )
      .subscribe({
        next: ([data, scenarioLevel, monster]: [{ normal: number[], elite: number[] }, number, Monster]) => {
          if (!data.normal?.length && !data.elite?.length) {
            return;
          }

          this._combatService.addToken$.next(Object.entries(data)
            .reduce((prev, [key, numbers]) => {
              return prev.concat(numbers.reduce((prev, nextTokenNumber) => {
                return prev.concat({
                  number: nextTokenNumber,
                  elite: key === 'elite',
                  maxHealth: monster.health[scenarioLevel][key === 'elite' ? 1 : 0],
                  monsterId: monster.id
                });
              }, [] as TokenInfo[]));
            }, [] as TokenInfo[]))
        }
      });
  }
}
