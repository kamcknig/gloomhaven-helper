import { Injectable } from '@angular/core';
import { AddTokenDialogComponent } from '../../monster/components/add-token-dialog/add-token-dialog.component';
import { filter, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { TokenInfo } from './model';
import { MatDialog } from '@angular/material/dialog';
import { AppService } from '../../app.service';
import { CombatService } from './combat.service';
import { Subject } from 'rxjs';
import { MonsterService } from '../../monster/services/monster.service';
import { ToggleEffectDialog } from "../../monster/components/toggle-effect-dialog/toggle-effect-dialog.component";
import {MonsterId} from "../../monster/services/model";

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  public addToken$: Subject<MonsterId> = new Subject<MonsterId>();
  public toggleTokenStatusEffect$: Subject<TokenInfo> = new Subject<TokenInfo>();

  constructor(
    private _monsterService: MonsterService,
    private _dialogService: MatDialog,
    private _appService: AppService,
    private _combatService: CombatService
  ) {
    this.toggleTokenStatusEffect$.pipe(
      switchMap(token => {
        return this._dialogService.open(ToggleEffectDialog, {
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
                maxHealth: monster.attributes.health[scenarioLevel - 1][key === 'elite' ? 1 : 0],
                monsterId: monster.id
              });
            }, [] as TokenInfo[]));
          }, [] as TokenInfo[]));
      }
    });
  }
}
