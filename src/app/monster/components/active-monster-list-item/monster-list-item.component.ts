import {Component, Input, OnInit} from '@angular/core';
import {MonsterService} from "../../services/monster.service";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";
import {Monster} from "../../services/model";

@Component({
  selector: 'monster-list-item',
  templateUrl: './monster-list-item.component.html',
  styleUrls: ['./monster-list-item.component.scss']
})
export class MonsterListItemComponent implements OnInit {
  @Input() public monsterId: number;

  public monster$: Observable<Monster>;

  constructor(
    private _monsterService: MonsterService
  ) {
  }

  ngOnInit(): void {
    this.monster$ = this._monsterService.monsterStore.activeMonsters$.pipe(
      map(monsters => monsters.find(m => m.id === this.monsterId))
    );
  }
}
