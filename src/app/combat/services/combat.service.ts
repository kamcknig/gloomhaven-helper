import { Injectable } from '@angular/core';
import { createAdapter } from '@state-adapt/core';
import { MonsterAbilityCard, MonsterService } from '../../monster/services/monster.service';
import { adapt } from '@state-adapt/angular';

export type CombatState = {
  [monsterId: string]: MonsterAbilityCard[]
};

@Injectable({
  providedIn: 'root'
})
export class CombatService {
  private _shuffleArray = (src: any[]) => {
    const out = src.concat();
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = out[i];
      out[i] = out[j];
      out[j] = temp;
    }
    return out;
  }

  private _adapter = createAdapter<CombatState>()({
    activateMonster: (state, event) => {
      return {
        ...state,
        [event.id]: [...event.abilities.reduce((prev: any[], next: MonsterAbilityCard) => {
          const count = next?.count ?? 1;
          for (let i = 0; i < count; i++) {
            prev.push({...next});
          }
          return prev;
        }, [])
          .map((a: any) => ({ ...a }))]
      }
    },
    drawAbilityCard: (state, event) => {
      let abilities = [...state[event]];
      let ability = abilities.find(a => !a.drawn);

      // if we couldn't find an ability that hasn't been drawn, shuffle the deck and
      // reset the drawn property on them all
      if (!ability) {
        abilities = this._shuffleArray(abilities)
          .map(a => ({ ...a, drawn: false }));
      } else {
        ability.drawn = true;
      }

      state[event] = abilities;
      return {
        ...state
      }
    }
  });

  public store = adapt(
    [
      'combat',
      {},
      this._adapter
    ],
    {
      drawAbilityCard: this._monsterService.drawAbilityCard$,
      activateMonster: this._monsterService.activateMonster$
    }
  )

  constructor(
    private _monsterService: MonsterService
  ) {
  }
}
