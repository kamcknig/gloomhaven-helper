import { Component, Input, OnInit } from '@angular/core';
import { AppService } from '../../../app.service';
import { AddTokenDialogComponent } from './add-token-dialog/add-token-dialog.component';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ApplicableConditions, ConditionAndEffectTypes, ConditionsAndEffects, Monster } from '../../services/model';
import { TokenInfo } from '../../../combat/services/model';
import { CombatService } from '../../../combat/services/combat.service';
import { MonsterService } from '../../services/monster.service';

@Component({
  selector: 'app-active-monster-card',
  templateUrl: './active-monster-card.component.html',
  styleUrls: ['./active-monster-card.component.scss']
})
export class ActiveMonsterCard implements OnInit {
  @Input() public monsterId: number;
  public monster$: Observable<Monster>;
  public tokens$: Observable<{ elites: TokenInfo[], normals: TokenInfo[] }> | undefined;
  public selectedToken: TokenInfo | undefined;
  public scenarioLevel$: Observable<number | undefined>;
  public ConditionsAndEffects = ConditionsAndEffects;
  public ApplicableConditions = ApplicableConditions;

  private _tokens: { elites: TokenInfo[], normals: TokenInfo[] } | undefined;
  private _destroy$: Subject<void> = new Subject<void>();

  constructor(
    public appService: AppService,
    public combatService: CombatService,
    private _dialogService: MatDialog,
    private _monsterService: MonsterService
  ) {
  }

  ngOnInit(): void {
    this.monster$ = this._monsterService.monsterStore.monsters$.pipe(map(m => m.find(m => m.id === this.monsterId)));

    this.tokens$ = this.combatService.store.tokens$.pipe(
      withLatestFrom(this.monster$),
      // gets the tokens that belong to this monster
      map(([tokens, monster]) => tokens.filter(t => t.monsterId === monster.id)),
      // separate them out into elites and normals
      map(tokenData => ({
        elites: tokenData.filter(t => !!t.elite)
          .sort((e1, e2) => e1.number - e2.number),
        normals: tokenData.filter(t => !t.elite)
          .sort((e1, e2) => e1.number - e2.number)
      })),
      tap(tokenData => {
        this._tokens = tokenData;

        if (this.selectedToken) {
          this.selectedToken = this._tokens?.elites?.concat(this._tokens?.normals)
            .find(t => t.number === this.selectedToken?.number && t.elite === this.selectedToken?.elite);
        }
      }),
      takeUntil(this._destroy$)
    );

    this.scenarioLevel$ = this.appService.scenarioStore.level$.pipe(takeUntil(this._destroy$));
  }

  getStatDisplayValue(value: number | string | undefined) {
    return value || '-';
  }

  addToken() {
    this._dialogService.open(AddTokenDialogComponent, {
      data: this._tokens,
      disableClose: false,
      width: '20rem'
    })
      .afterClosed()
      .pipe(
        withLatestFrom(
          this.appService.scenarioStore.level$,
          this.monster$
        )
      )
      .subscribe({
        next: ([data, scenarioLevel, monster]: [{ normal: number[], elite: number[] }, number, Monster]) => {
          if (!data.normal?.length && !data.elite?.length) {
            return;
          }

          this.combatService.addToken$.next(Object.entries(data)
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

  showStatusSelectOverlay(token: TokenInfo) {
    this.selectedToken = token;
  }

  closeStatusSelectOverlay() {
    this.selectedToken = undefined;
  }

  getTokenConditionsAndEffects(token: TokenInfo) {
    return Object.entries(token.appliedConditionsAndEffects ?? {})
      .reduce((prev, next) => {
        if (next[1]) {
          prev.push({ name: next[0], value: next[1] });
        }
        return prev;
      }, [] as { name: string, value: number }[]);
  }

  hasCondition(condition: ConditionAndEffectTypes, elite: boolean): Observable<boolean | [number, number]> {
    return this.monster$.pipe(
      withLatestFrom(this.scenarioLevel$),
      map(([monster, level]) => {
        const tmp = monster?.conditionsAndEffects?.[condition]?.[level ?? 0]?.[elite ? 1 : 0] ?? 0;
        if (typeof tmp === 'number') {
          return tmp > 0;
        } else if(typeof tmp[0] === 'number') {
          return tmp[0] > 0;
        }

        return tmp;
      }),
      takeUntil(this._destroy$)
    );
  }

  showAdditionalConditionEffectInfo(condition: string) {
    return ['Retaliate', 'Pierce', 'Pull', 'Shield', 'Target'].includes(condition);
  }

  monsterHasConditionEffect(condition: string, elite: boolean = false): Observable<boolean> {
    return this.monster$.pipe(
      withLatestFrom(this.scenarioLevel$),
      map(([monster, level]) => {
        return monster?.conditionsAndEffects?.[condition]?.[level ?? 0]?.[elite ? 1 : 0] > 0
          || monster?.conditionsAndEffects?.[condition]?.[level ?? 0]?.[elite ? 1 : 0]?.[0] > 0;
      }),
      takeUntil(this._destroy$)
    )
  }
}
