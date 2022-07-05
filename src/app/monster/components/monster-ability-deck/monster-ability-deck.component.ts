import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Monster, MonsterAbilityCard, MonsterService } from '../../services/monster.service';
import { CombatService } from '../../../combat/services/combat.service';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-monster-ability-deck',
  templateUrl: './monster-ability-deck.component.html',
  styleUrls: ['./monster-ability-deck.component.scss']
})
export class MonsterAbilityDeckComponent implements OnInit {
  @Input() public value: Monster;

  public activeCard$: Observable<MonsterAbilityCard>;

  @HostListener('click') public clickListener() {
    this._monsterService.drawAbilityCard$.next(this.value.id);
  }

  constructor(
    private _monsterService: MonsterService,
    private _combatService: CombatService
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
