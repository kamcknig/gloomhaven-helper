import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import {
  ApplicableConditions, ConditionAndEffectsType,
  ConditionsAndEffects,
  MonsterInfo,
  MonsterService
} from '../../services/monster.service';
import { AppService } from '../../../app.service';
import { TokenInfo, TokenService } from '../../../token/services/token.service';
import { AddTokenDialogComponent } from './add-token-dialog/add-token-dialog.component';
import { map, Observable, Subject, takeUntil, tap, withLatestFrom } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-active-monster-card',
  templateUrl: './active-monster-card.component.html',
  styleUrls: ['./active-monster-card.component.scss']
})
export class ActiveMonsterCard implements OnInit, AfterViewInit {
  @Input() public value: MonsterInfo | undefined;
  public tokens$: Observable<{ elites: TokenInfo[], normals: TokenInfo[] }> | undefined;
  public selectedToken: TokenInfo | undefined;
  public scenarioLevel: number | undefined;
  public ConditionsAndEffects = ConditionsAndEffects;
  public ApplicableConditions = ApplicableConditions;

  private _tokens: { elites: TokenInfo[], normals: TokenInfo[] } | undefined;
  private _destroy$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this.tokens$ = this.tokenService.tokenStore.tokens$.pipe(
      // gets the tokens that belong to this monster
      map(tokens => tokens.filter(t => t.monsterId === this.value!.id)),
      // separate them out into elites and normals
      map(tokenData => ({
        elites: tokenData.filter(t => !!t.elite),
        normals: tokenData.filter(t => !t.elite)
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

    this.appService.scenarioStore.level$.pipe(takeUntil(this._destroy$))
      .subscribe(v => this.scenarioLevel = v);
  }

  ngAfterViewInit() {

  }

  constructor(
    public monsterService: MonsterService,
    public appService: AppService,
    public tokenService: TokenService,
    private _dialogService: MatDialog
  ) {
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
          this.appService.scenarioStore.level$
        )
      )
      .subscribe({
        next: ([[tokenNumber, elite] = [NaN], scenarioLevel]) => {
          if (isNaN(tokenNumber)) {
            return;
          }

          this.tokenService.addToken$.next({
            number: tokenNumber,
            elite: elite,
            maxHealth: this.value!.health[scenarioLevel][elite ? 1 : 0],
            monsterId: this.value!.id
          })
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

  setTokenHp(token: TokenInfo, event: any) {
    this.tokenService.updateTokenHitPoint$.next([token, event.target?.value ?? 0])
  }

  hasCondition(condition: ConditionAndEffectsType, elite: boolean) {
    const tmp = this.value?.conditionsAndEffects?.[condition]?.[this.scenarioLevel ?? 0]?.[elite ? 1 : 0] ?? 0;
    if (typeof tmp === 'number') {
      return tmp > 0;
    }

    return tmp[0] > 0;
  }
}
