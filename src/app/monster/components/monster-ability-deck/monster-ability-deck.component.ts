import { Component, Input, OnInit } from '@angular/core';
import { CombatService } from '../../../combat/services/combat.service';
import { Observable } from 'rxjs';
import { map, startWith, withLatestFrom } from 'rxjs/operators';
import { Monster, MonsterAbilityCard } from '../../services/model';
import { MonsterService } from '../../services/monster.service';

@Component({
  selector: 'app-monster-ability-deck',
  templateUrl: './monster-ability-deck.component.html',
  styleUrls: ['./monster-ability-deck.component.scss']
})
export class MonsterAbilityDeckComponent implements OnInit {
  @Input() public monsterId: number;
  public monster$: Observable<Monster>;

  public disabled$: Observable<boolean>;
  public activeCard$: Observable<MonsterAbilityCard>;

  constructor(
    private _combatService: CombatService,
    public monsterService: MonsterService
  ) { }

  ngOnInit(): void {
    this.monster$ = this.monsterService.monsterStore.monsters$.pipe(map(m => m.find(m => m.id === this.monsterId)));

    this.disabled$ = this._combatService.store.tokens$.pipe(
      map(tokens => !tokens.some(t => t.monsterId === this.monsterId))
    );

    const deck$ = this._combatService.store.activeMonsters$.pipe(
      withLatestFrom(this.monster$),
      map(([value, monster]) => value[monster.id])
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
