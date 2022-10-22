import {Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MonsterService} from "../../services/monster.service";
import {Observable} from "rxjs";
import {AppService} from "../../../app.service";

@Component({
  selector: 'app-monster-level',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './monster-level.component.html',
  styleUrls: ['./monster-level.component.scss']
})
export class MonsterLevelComponent implements OnInit {
  @Input() monsterId: number;

  public monsterLevel$: Observable<number>;
  public scenarioLevel$: Observable<number>;

  constructor(
    public monsterService: MonsterService,
    public appService: AppService
  ) { }

  ngOnInit(): void {
    this.scenarioLevel$ = this.appService.scenarioStore.level$;
    this.monsterLevel$ = this.appService.monsterLevel(this.monsterId);
  }
}
