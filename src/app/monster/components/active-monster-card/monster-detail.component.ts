import { Component, Input, OnInit } from '@angular/core';
import { AppService } from '../../../app.service';
import { Observable, of, Subject } from 'rxjs';
import { map, take, takeUntil, withLatestFrom } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ConditionAndEffectTypes, ConditionsAndEffects, Monster } from '../../services/model';
import { TokenInfo } from '../../../combat/services/model';
import { CombatService } from '../../../combat/services/combat.service';
import { MonsterService } from '../../services/monster.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MonsterAbilityDeckComponent } from '../monster-ability-deck/monster-ability-deck.component';
import { TokenListItemComponent } from '../../../token/components/token-list-item/token-list-item.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MonsterStatsComponent } from '../monster-stats-component/monster-stats.component';
import { TokenService } from '../../../combat/services/token.service';
import { MonsterLevelComponent } from "../monster-level/monster-level.component";

@Component({
  selector: 'monster-detail',
  templateUrl: './monster-detail.component.html',
  styleUrls: ['./monster-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    FlexLayoutModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MonsterAbilityDeckComponent,
    TokenListItemComponent,
    DragDropModule,
    MonsterStatsComponent,
    MonsterLevelComponent
  ]
})
export class MonsterDetailComponent implements OnInit {
  @Input() public monster: Monster;

  public tokens$: Observable<{ elites: TokenInfo[], normals: TokenInfo[] }> | undefined;
  public monsterLevel$: Observable<number | undefined>;
  public scenarioLevel$: Observable<number | undefined>;
  public tokenCount$: Observable<number>;
  public ConditionsAndEffects = ConditionsAndEffects;

  private _destroy$: Subject<void> = new Subject<void>();

  constructor(
    public tokenService: TokenService,
    public appService: AppService,
    public combatService: CombatService,
    private _dialogService: MatDialog,
    public monsterService: MonsterService
  ) {
  }

  ngOnInit(): void {
    this.scenarioLevel$ = this.appService.scenarioStore.level$;

    const tokens = this.combatService.store.tokens$.pipe(
      // gets the tokens that belong to this monster
      map(tokens => tokens.filter(t => t.monsterId === this.monster.id))
    );

    this.tokenCount$ = tokens.pipe(map(tokens => tokens?.length ?? 0));

    this.tokens$ = tokens.pipe(
      // separate them out into elites and normals
      map(tokenData => ({
        elites: tokenData.filter(t => !!t.elite)
          .sort((e1, e2) => e1.number - e2.number),
        normals: tokenData.filter(t => !t.elite)
          .sort((e1, e2) => e1.number - e2.number)
      })),
      takeUntil(this._destroy$)
    );

    this.monsterLevel$ = this.appService.monsterLevel(this.monster.id);
  }

  removeMonster() {
    this.monsterService.deactivateMonster$.next(this.monster);
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

  hasCondition(condition: ConditionAndEffectTypes, elite: boolean): boolean | [number, number] {
    let out;
    of(this.monster).pipe(
      withLatestFrom(this.monsterLevel$),
      map(([monster, level]) => {
        const tmp = monster?.conditionsAndEffects?.[condition]?.[level ?? 0]?.[elite ? 1 : 0] ?? 0;
        if (typeof tmp === 'number') {
          return tmp > 0;
        } else if(typeof tmp[0] === 'number') {
          return tmp[0] > 0;
        }

        return tmp;
      }),
      take(1)
    ).subscribe({
      next: result => { out = result; }
    });

    return out;
  }

  showAdditionalConditionEffectInfo(condition: string) {
    return ['Retaliate', 'Pierce', 'Pull', 'Shield', 'Target'].includes(condition);
  }

  monsterHasConditionEffect(condition: string, elite: boolean = false): boolean {
    let out;
    of(this.monster).pipe(
      withLatestFrom(this.monsterLevel$),
      map(([monster, level]) => {
        return monster?.conditionsAndEffects?.[condition]?.[level ?? 0]?.[elite ? 1 : 0] > 0
          || monster?.conditionsAndEffects?.[condition]?.[level ?? 0]?.[elite ? 1 : 0]?.[0] > 0;
      }),
      take(1)
    ).subscribe({
      next: result => { out = result; }
    });

    return out;
  }
}
