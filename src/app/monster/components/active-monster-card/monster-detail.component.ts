import {Component, Input, OnInit} from '@angular/core';
import {AppService} from '../../../app.service';
import {BehaviorSubject, combineLatest, Observable, Subject} from 'rxjs';
import {map, takeUntil} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {isBoss, Monster} from '../../services/model';
import {TokenInfo} from '../../../combat/services/model';
import {CombatService} from '../../../combat/services/combat.service';
import {MonsterService} from '../../services/monster.service';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MonsterAbilityDeckComponent} from '../monster-ability-deck/monster-ability-deck.component';
import {TokenListItemComponent} from '../../../token/components/token-list-item/token-list-item.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MonsterAttributesComponent} from '../monster-attributes-component/monster-attributes.component';
import {TokenService} from '../../../combat/services/token.service';
import {MonsterLevelComponent} from "../monster-level/monster-level.component";
import {MonsterStatComponent} from "../monster-stat/monster-stat.component";
import {MonsterStatPipe} from '../../pipes/monster-stat.pipe';
import {ConditionListPipe} from '../../pipes/condition-list.pipe';
import {AttackEffectListPipe} from '../../pipes/attack-effect-list.pipe';
import {BonusListPipe} from '../../pipes/bonus-list.pipe';
import {LetModule} from "@ngrx/component";
import {CombatActionsComponent} from "../../../combat/components/combat-actions/combat-actions.component";

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
    MonsterAttributesComponent,
    MonsterLevelComponent,
    MonsterStatComponent,
    MonsterStatPipe,
    ConditionListPipe,
    AttackEffectListPipe,
    BonusListPipe,
    LetModule,
    CombatActionsComponent
  ]
})
export class MonsterDetailComponent implements OnInit {
  private _monster: Monster;

  public isBoss = isBoss;

  public monster$: BehaviorSubject<Monster> = new BehaviorSubject<Monster>(undefined);

  get monster(): Monster {
    return this._monster;
  }

  @Input() set monster(value: Monster) {
    this._monster = value;
    this.monster$.next(value);
  }

  public tokens$: Observable<{ elites: TokenInfo[], normals: TokenInfo[] }> | undefined;
  public monsterLevel$: Observable<number | undefined>;
  public scenarioLevel$: Observable<number | undefined>;
  public tokenCount$: Observable<number>;

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

    const tokens = combineLatest([
      this.combatService.store.tokens$,
      this.monster$
    ])
      .pipe(
        // gets the tokens that belong to this monster
        map(([tokens, monster]) => tokens.filter(t => t.monsterId === monster.id))
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

    this.monsterLevel$ = this.appService.monsterLevel(this.monster$.value.id).level$;
  }

  removeMonster() {
    this.monsterService.deactivateMonster$.next(this.monster$.value);
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
}
