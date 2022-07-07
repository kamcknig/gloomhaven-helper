import { Injectable } from '@angular/core';
import { createAdapter, Source } from '@state-adapt/core';
import { MonsterService } from '../../monster/services/monster.service';
import { adapt } from '@state-adapt/angular';
import { MonsterAbilityCard } from '../../monster/services/model';
import { CombatState } from './model';

@Injectable({
  providedIn: 'root'
})
export class CombatService {
  public roundComplete$ = new Source<void>('roundCompleted$');

  private shuffleArray = (src: any[]) => {
    for (let i = src.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = src[i];
      src[i] = src[j];
      src[j] = temp;
    }
  }

  private drawCard(abilities: MonsterAbilityCard[]) {
    let ability = abilities.find(a => !a.drawn);

    // if we couldn't find an ability that hasn't been drawn, shuffle the deck and
    // reset the drawn property on them all
    if (!ability) {
      this.shuffleArray(abilities);
      abilities.forEach(a => a.drawn = false);
      ability = abilities[0];
    }

    ability.drawn = true;
  }

  private _adapter = createAdapter<CombatState>()({
    monsterActivate: (state, event) => {
      return {
        ...state,
        [event.id]: event.abilities.reduce((prev: any[], next: MonsterAbilityCard) => {
          const count = next?.count ?? 1;
          for (let i = 0; i < count; i++) {
            prev.push({ ...next });
          }
          return prev;
        }, [])
          .map((a: any) => ({ ...a }))
      }
    },
    monsterAbilityCardDraw: (state, event) => {
      let abilities = [...state[event]];
      this.drawCard(abilities);

      return {
        ...state,
        [event]: abilities
      }
    },
    roundComplete: (state) => {
      return Object.entries(state).reduce((prev, [id, cards]) => {
        for (let i = cards.length - 1; i >= 0; i--) {
          if (cards[i].drawn && cards[i].shuffle) {
            this.shuffleArray(cards);
            cards.forEach(c => c.drawn = false);
            break;
          }
        }
        this.drawCard(cards);

        prev[id] = cards;
        return prev;
      }, {} as CombatState);
    }
  });

  public store = adapt(
    'combat',
    {},
    this._adapter,
    {
      monsterAbilityCardDraw: this._monsterService.monsterAbilityCardDraw$,
      monsterActivate: this._monsterService.monsterActivate$,
      roundComplete: this.roundComplete$
    }
  )

  constructor(
    private _monsterService: MonsterService
  ) {
  }
}
