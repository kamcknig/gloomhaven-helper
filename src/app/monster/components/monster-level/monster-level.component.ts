import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MonsterService} from "../../services/monster.service";
import {BehaviorSubject, Observable} from "rxjs";
import {AppService} from "../../../app.service";
import {Monster} from "../../services/model";
import {switchMap} from "rxjs/operators";
import {LetModule} from "@ngrx/component";

@Component({
  selector: 'app-monster-level',
  standalone: true,
  imports: [CommonModule, LetModule],
  templateUrl: './monster-level.component.html',
  styleUrls: ['./monster-level.component.scss']
})
export class MonsterLevelComponent implements OnInit {

  @Input() public set monster(value: Monster) {
    this.monster$.next(value);
  };

  public monster$: BehaviorSubject<Monster> = new BehaviorSubject<Monster>(undefined);

  public monsterLevel$: Observable<number>;
  public scenarioLevel$: Observable<number>;

  constructor(
    public monsterService: MonsterService,
    public appService: AppService
  ) { }

  ngOnInit(): void {
    this.scenarioLevel$ = this.appService.scenarioStore.level$;
    this.monsterLevel$ = this.monster$.pipe(switchMap(m => this.appService.monsterLevel(m.id).level$));
  }
}
