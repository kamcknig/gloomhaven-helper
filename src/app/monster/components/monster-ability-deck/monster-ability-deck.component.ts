import {Component, Input, OnInit} from '@angular/core';
import {CombatService} from '../../../combat/services/combat.service';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {isBoss, Monster, MonsterAbility} from '../../services/model';
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
  private _monster$: BehaviorSubject<Monster> = new BehaviorSubject<Monster>(undefined);
  private _monster: Monster;

  get monster(): Monster {
    return this._monster;
  }

  @Input()
  set monster(value: Monster) {
    this._monster = value;
    this._monster$.next(value);
  }

  public disabled$: Observable<boolean>;
  public activeCard$: Observable<MonsterAbility>;

  constructor(
    private _combatService: CombatService,
    public monsterService: MonsterService
  ) { }

  ngOnInit(): void {
    this.disabled$ = combineLatest([
      this._monster$,
      this._combatService.store.tokens$.pipe(
        map(tokens => !tokens.some(t => t.monsterId === this._monster.id))
      )
    ]).pipe(map(([monster, tokens]) => !isBoss(monster) && tokens));

    const deck$ = this._monster$.pipe(
      switchMap(monster => this._combatService.store.activeMonsters$.pipe(map(value => value[monster.id]?.abilities)))
    );

    this.activeCard$ = combineLatest([
      deck$,
      this._monster$,
      this._combatService.store.activeMonsters$
    ]).pipe(
      map(([deck, monster, combatMobs]) => {
        if (!deck?.length) {
          return undefined;
        }

        return deck[combatMobs[monster.id].card];
      })
    );
  }
}
