import {Component, ElementRef, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import {MonsterService} from "../../services/monster.service";
import {BehaviorSubject, combineLatest, Observable} from "rxjs";
import {Monster} from "../../services/model";
import {FlexLayoutModule} from '@angular/flex-layout';
import {CommonModule} from '@angular/common';
import {AppService} from '../../../app.service';
import {MonsterAttributesComponent} from '../monster-attributes-component/monster-attributes.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {TokenService} from "../../../combat/services/token.service";
import {MonsterLevelComponent} from "../monster-level/monster-level.component";
import {MatDividerModule} from "@angular/material/divider";
import {MonsterAbilityDeckComponent} from '../monster-ability-deck/monster-ability-deck.component';
import {CombatService} from '../../../combat/services/combat.service';
import {TokenInfo} from "../../../combat/services/model";
import {map, switchMap} from "rxjs/operators";
import {TokenHealthComponent} from '../../../combat/components/token-health/token-health.component';
import {MonsterStatComponent} from '../monster-stat/monster-stat.component';
import {MonsterStatPipe} from '../../pipes/monster-stat.pipe';
import {ConditionListPipe} from '../../pipes/condition-list.pipe';
import {AttackEffectListPipe} from '../../pipes/attack-effect-list.pipe';
import {BonusListPipe} from '../../pipes/bonus-list.pipe';
import {LetModule} from "@ngrx/component";

@Component({
  selector: 'monster-list-item',
  templateUrl: './monster-list-item.component.html',
  styleUrls: ['./monster-list-item.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FlexLayoutModule,
    MonsterAttributesComponent,
    MatButtonModule,
    MatIconModule,
    MonsterLevelComponent,
    MatDividerModule,
    MonsterAbilityDeckComponent,
    TokenHealthComponent,
    MonsterStatComponent,
    MonsterStatPipe,
    ConditionListPipe,
    AttackEffectListPipe,
    BonusListPipe,
    LetModule
  ]
})
export class MonsterListItemComponent implements OnInit {
  @ViewChild('leftSection') leftSection: ElementRef;
  @ViewChild('rightSection') rightSection: ElementRef;

  @Input() public active: boolean;

  public monster$: BehaviorSubject<Monster> = new BehaviorSubject<Monster>(undefined);

  @Input()
  public set monster(value: Monster) {
    this.monster$.next(value);
  };

  public tokens$: Observable<{ elite: TokenInfo[], normal: TokenInfo[] }>;
  public tokenCount$: Observable<number>;
  public monsterLevel$: Observable<number>;

  constructor(
    private _renderer: Renderer2,
    private _monsterService: MonsterService,
    private _appService: AppService,
    public tokenService: TokenService,
    public combatService: CombatService
  ) {
  }

  public ngOnInit(): void {
    this.monsterLevel$ = this.monster$.pipe(switchMap(m => this._appService.monsterLevel(m.id).level$));

    const tokens = combineLatest([
      this.monster$,
      this.combatService.store.tokens$
    ]).pipe(
      map(([m, tokens]) => tokens.filter(t => t.monsterId === m.id))
    );

    this.tokenCount$ = tokens.pipe(map(tokens => tokens?.length ?? 0));

    this.tokens$ = tokens.pipe(
      map(tokens => tokens.reduce((prev, next) => {
        prev[next.elite ? 'elite' : 'normal'].push(next);
        return prev;
      }, {elite: [], normal: []}))
    );
  }
}
