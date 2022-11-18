import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MonsterService } from "../../services/monster.service";
import { Observable, of } from "rxjs";
import { ConditionAndEffectTypes, ConditionsAndEffects, Monster } from "../../services/model";
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { AppService } from '../../../app.service';
import { MonsterStatsComponent } from '../monster-stats-component/monster-stats.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TokenService } from "../../../combat/services/token.service";
import { MonsterLevelComponent } from "../monster-level/monster-level.component";
import { MatDividerModule } from "@angular/material/divider";
import { MonsterAbilityDeckComponent } from '../monster-ability-deck/monster-ability-deck.component';
import { CombatService } from '../../../combat/services/combat.service';
import { TokenInfo } from "../../../combat/services/model";
import { map, take, withLatestFrom } from "rxjs/operators";
import { TokenHealthComponent } from '../../../combat/components/token-health/token-health.component';
import { MonsterStatComponent } from '../monster-stat/monster-stat.component';
import { MonsterStatPipePipe } from '../../pipes/monster-stat.pipe';

@Component({
  selector: 'monster-list-item',
  templateUrl: './monster-list-item.component.html',
  styleUrls: ['./monster-list-item.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FlexLayoutModule,
    MonsterStatsComponent,
    MatButtonModule,
    MatIconModule,
    MonsterLevelComponent,
    MatDividerModule,
    MonsterAbilityDeckComponent,
    TokenHealthComponent,
    MonsterStatComponent,
    MonsterStatPipePipe
  ]
})
export class MonsterListItemComponent implements OnInit {
  @ViewChild('leftSection') leftSection: ElementRef;
  @ViewChild('rightSection') rightSection: ElementRef;

  @Input() public monster: Monster;
  @Input() public active: boolean;

  public tokens$: Observable<{ elite: TokenInfo[], normal: TokenInfo[] }>;
  public tokenCount$: Observable<number>;
  public monsterLevel$: Observable<number>;
  public ConditionsAndEffects = ConditionsAndEffects;

  constructor(
    private _renderer: Renderer2,
    private _monsterService: MonsterService,
    private _appService: AppService,
    public tokenService: TokenService,
    public combatService: CombatService
  ) {
  }

  public ngOnInit(): void {
    this.monsterLevel$ = this._appService.monsterLevel(this.monster.id).level$;

    const tokens = this.combatService.store.tokens$.pipe(
      map(tokens => tokens.filter(t => t.monsterId === this.monster.id))
    );

    this.tokenCount$ = tokens.pipe(map(tokens => tokens?.length ?? 0));

    this.tokens$ = tokens.pipe(
      map(tokens => tokens.reduce((prev, next) => {
        prev[next.elite ? 'elite' : 'normal'].push(next);
        return prev;
      }, { elite: [], normal: [] }))
    );
  }

  hasCondition(condition: ConditionAndEffectTypes, elite: boolean): boolean | [number, number] {
    let out;
    of(this.monster)
      .pipe(
        withLatestFrom(this.monsterLevel$.pipe(map(level => level - 1))),
        map(([monster, level]) => {
          const tmp = monster?.conditionsAndEffects?.[condition]?.[level ?? 0]?.[elite ? 1 : 0] ?? 0;
          if (typeof tmp === 'number') {
            return tmp > 0;
          } else if (typeof tmp[0] === 'number') {
            return tmp[0] > 0;
          }

          return tmp;
        }),
        take(1)
      )
      .subscribe({
        next: result => {
          out = result;
        }
      });

    return out;
  }
}
