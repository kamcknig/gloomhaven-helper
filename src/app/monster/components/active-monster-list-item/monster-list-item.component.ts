import {Component, Input, OnInit} from '@angular/core';
import {MonsterService} from "../../services/monster.service";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";
import {Monster} from "../../services/model";
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { AppService } from '../../../app.service';
import { MonsterStatsComponent } from '../monster-stats-component/monster-stats.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {TokenService} from "../../../combat/services/token.service";
import {MonsterLevelComponent} from "../monster-level/monster-level.component";

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
    MonsterLevelComponent
  ]
})
export class MonsterListItemComponent implements OnInit {
  @Input() public monsterId: number;

  public monster$: Observable<Monster>;
  public monsterLevel$: Observable<number>;

  constructor(
    private _monsterService: MonsterService,
    private _appService: AppService,
    public tokenService: TokenService
  ) {
  }

  ngOnInit(): void {
    this.monster$ = this._monsterService.monsterStore.activeMonsters$.pipe(
      map(monsters => monsters.find(m => m.id === this.monsterId))
    );

    this.monsterLevel$ = this._appService.monsterLevel(this.monsterId);
  }
}
