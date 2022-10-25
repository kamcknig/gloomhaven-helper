import {Component, Input, OnInit} from '@angular/core';
import {CombatService} from '../../../combat/services/combat.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Monster, MonsterAbility} from '../../services/model';
import {MonsterService} from '../../services/monster.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-monster-ability-deck',
  templateUrl: './monster-ability-deck.component.html',
  styleUrls: ['./monster-ability-deck.component.scss'],
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class MonsterAbilityDeckComponent implements OnInit {
  @Input() public monster: Monster;

  public disabled$: Observable<boolean>;
  public activeCard$: Observable<MonsterAbility>;

  constructor(
    private _combatService: CombatService,
    public monsterService: MonsterService
  ) { }

  ngOnInit(): void {
    this.disabled$ = this._combatService.store.tokens$.pipe(
      map(tokens => !tokens.some(t => t.monsterId === this.monster.id))
    );

    const deck$ = this._combatService.store.activeMonsters$.pipe(
      map(value => value[this.monster.id]?.abilities)
    );

    this.activeCard$ = deck$.pipe(
      map(value => {
        if (!value?.length) {
          return undefined;
        }

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
