import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { MonsterService } from '../../services/monster.service';
import { AppService } from '../../../app.service';
import { TokenService } from '../../../token/services/token.service';
import { AddTokenDialogComponent } from './add-token-dialog/add-token-dialog.component';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ApplicableConditions, ConditionAndEffectsType, ConditionsAndEffects, Monster } from '../../services/model';
import { TokenInfo } from '../../../token/services/model';

@Component({
  selector: 'app-active-monster-card',
  templateUrl: './active-monster-card.component.html',
  styleUrls: ['./active-monster-card.component.scss']
})
export class ActiveMonsterCard implements OnInit, AfterViewInit {
  @Input() public value: Monster | undefined;
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

    this.appService.scenarioStore.level$.pipe(takeUntil(this._destroy$))
      .subscribe({
        next: v => this.scenarioLevel = v
      });
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
        next: ([data, scenarioLevel]: [{ normal: number[], elite: number[] }, number]) => {
          if (!data.normal?.length && !data.elite?.length) {
            return;
          }

          this.tokenService.addToken$.next(Object.entries(data)
            .reduce((prev, [key, numbers]) => {
              return prev.concat(numbers.reduce((prev, nextTokenNumber) => {
                return prev.concat({
                  number: nextTokenNumber,
                  elite: key === 'elite',
                  maxHealth: this.value!.health[scenarioLevel][key === 'elite' ? 1 : 0],
                  monsterId: this.value!.id
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

  hasCondition(condition: ConditionAndEffectsType, elite: boolean) {
    const tmp = this.value?.conditionsAndEffects?.[condition]?.[this.scenarioLevel ?? 0]?.[elite ? 1 : 0] ?? 0;
    if (typeof tmp === 'number') {
      return tmp > 0;
    } else if(typeof tmp[0] === 'number') {
      return tmp[0] > 0;
    }

    return tmp;
  }

  showAdditionalConditionEffectInfo(condition: string) {
    return ['Retaliate', 'Pierce', 'Pull', 'Shield', 'Target'].includes(condition);
  }

  monsterHasConditionEffect(condition: string, elite: boolean = false) {
    return this.value?.conditionsAndEffects?.[condition]?.[this.scenarioLevel ?? 0]?.[elite ? 1 : 0] > 0
      || this.value?.conditionsAndEffects?.[condition]?.[this.scenarioLevel ?? 0]?.[elite ? 1 : 0]?.[0] > 0;
  }
}
