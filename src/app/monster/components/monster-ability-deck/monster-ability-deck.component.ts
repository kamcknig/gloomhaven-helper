import { Component, Input, OnInit } from '@angular/core';
import { CombatService } from '../../../combat/services/combat.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Monster, MonsterAbilityCard } from '../../services/model';
import { MonsterService } from '../../services/monster.service';

@Component({
  selector: 'app-monster-ability-deck',
  templateUrl: './monster-ability-deck.component.html',
  styleUrls: ['./monster-ability-deck.component.scss']
})
export class MonsterAbilityDeckComponent implements OnInit {
  @Input() public value: Monster;

  public activeCard$: Observable<MonsterAbilityCard>;

  constructor(
    private _combatService: CombatService,
    public monsterService: MonsterService
  ) { }

  ngOnInit(): void {
    const deck$ = this._combatService.store.state$.pipe(
      map(value => value[this.value.id])
    );

    this.activeCard$ = deck$.pipe(
      map(value => {
        for (let i = value.length - 1; i >= 0; i--) {
          if (value[i].drawn) {
            return value[i];
          }
        }
        return undefined;
      })
    );
  }
}
