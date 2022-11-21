import { Injectable } from '@angular/core';
import { AddTokenDialogComponent } from '../../monster/components/add-token-dialog/add-token-dialog.component';
import { filter, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { TokenInfo } from './model';
import { MatDialog } from '@angular/material/dialog';
import { AppService } from '../../app.service';
import { CombatService } from './combat.service';
import { Subject } from 'rxjs';
import { MonsterService } from '../../monster/services/monster.service';
import {
  ToggleStatusEffectDialogComponent
} from "../../monster/components/toggle-status-effect-dialog/toggle-status-effect-dialog.component";

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  public addToken$: Subject<number> = new Subject<number>();
  public toggleTokenStatusEffect$: Subject<TokenInfo> = new Subject<TokenInfo>();

  constructor(
    private _monsterService: MonsterService,
    private _dialogService: MatDialog,
    private _appService: AppService,
    private _combatService: CombatService
  ) {
    this.toggleTokenStatusEffect$.pipe(
      switchMap(token => {
        return this._dialogService.open(ToggleStatusEffectDialogComponent, {
          width: '450px',
          disableClose: false,
          data: token
        }).afterClosed()
      })
    ).subscribe();

    this.addToken$.pipe(
      withLatestFrom(
        this._monsterService.monsterStore.activeMonsters$,
        this._combatService.store.tokens$
      ),
      switchMap(([monsterId, monsters, tokens]) => {
        const monster = monsters.find(m => m.id === monsterId);
        const monsterTokens = tokens.filter(t => t.monsterId === monsterId);

        return this._dialogService.open(AddTokenDialogComponent, {
          data: monsterTokens,
          disableClose: false,
          width: '20rem'
        })
          .afterClosed().pipe(map(result => [result, monster]));
      }),
      filter(([result,]) => !!result?.normal?.length || !!result?.elite?.length),
      withLatestFrom(this._appService.scenarioStore.level$)
    ).subscribe({
      next: ([[data, monster], scenarioLevel]) => {
        this._combatService.addToken$.next(Object.entries(data)
          .reduce((prev, [key, numbers]) => {
            return prev.concat((numbers as number[]).reduce((prev, nextTokenNumber) => {
              return prev.concat({
                number: nextTokenNumber,
                elite: key === 'elite',
                maxHealth: monster.attributes.health[scenarioLevel][key === 'elite' ? 1 : 0],
                monsterId: monster.id
              });
            }, [] as TokenInfo[]));
          }, [] as TokenInfo[]));
      }
    });
  }
}
