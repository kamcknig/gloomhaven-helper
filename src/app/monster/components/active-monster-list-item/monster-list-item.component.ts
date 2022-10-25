import { AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MonsterService } from "../../services/monster.service";
import { Observable } from "rxjs";
import { Monster } from "../../services/model";
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
import { map } from "rxjs/operators";
import { TokenHealthComponent } from '../../../combat/components/token-health/token-health.component';

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
    TokenHealthComponent
  ]
})
export class MonsterListItemComponent implements OnInit, AfterViewInit {
  @ViewChild('leftSection') leftSection: ElementRef;
  @ViewChild('rightSection') rightSection: ElementRef;

  @Input() public monster: Monster;
  @Input() public active: boolean;

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
    this.monsterLevel$ = this._appService.monsterLevel(this.monster.id);

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

  public ngAfterViewInit(): void {
    //this._renderer.setStyle(this.rightSection.nativeElement, 'max-height', this.leftSection.nativeElement.clientHeight);
  }
}
