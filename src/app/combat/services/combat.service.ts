import { Injectable } from '@angular/core';
import { createAdapter } from '@state-adapt/core';
import { MonsterService } from '../../monster/services/monster.service';
import { adapt } from '@state-adapt/angular';
import { MonsterAbilityCard } from '../../monster/services/model';
import { CombatState, TokenInfo } from './model';
import { Source } from '@state-adapt/rxjs';

@Injectable({
  providedIn: 'root'
})
export class CombatService {
  public roundComplete$ = new Source<void>('roundCompleted$');
  public addToken$: Source<TokenInfo[] | TokenInfo> = new Source('addToken$');
  public updateTokenHitPoint$: Source<[TokenInfo, number]> = new Source('updateTokenHitPoint$');
  public toggleTokenCondition$: Source<{ token: TokenInfo, condition: string }> = new Source(
    'toggleTokenCondition$');

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
    addToken: (state, event: TokenInfo | TokenInfo[]) => {
      event = Array.isArray(event) ? event : [event];
      return {
        ...state,
        tokens: [
          ...state.tokens,
          ...event
        ]
      };
    },
    updateTokenHitPoint: (state, event: [TokenInfo, number]) => {
      const tokens = [...state.tokens];
      const idx = tokens.findIndex(t => t.monsterId === event[0].monsterId && t.number === event[0].number);
      if (idx === -1) {
        return state;
      }
      const token = tokens[idx];
      tokens.splice(idx, 1, { ...token, health: event[1] });

      if ((tokens[idx].health ?? 0) < 1) {
        tokens.splice(idx, 1);
      }

      return {
        ...state,
        tokens: [...tokens]
      }
    },
    toggleTokenCondition: (state, { token, condition }) => {
      const tokens = [...state.tokens];
      const idx = tokens.findIndex(t => t.monsterId === token.monsterId && t.number === token.number);
      if (idx === -1) {
        return state;
      }
      const newToken = tokens[idx];
      tokens.splice(
        idx,
        1,
        {
          ...newToken,
          appliedConditionsAndEffects: {
            ...newToken.appliedConditionsAndEffects,
            [condition]: (newToken.appliedConditionsAndEffects?.[condition] ?? 0) > 0 ? 0 : 1
          }
        }
      );

      return {
        ...state,
        tokens: [...tokens]
      };
    },
    monsterActivate: (state, event) => ({
      ...state,
      activeMonsters: {
        ...state.activeMonsters,
        [event.id]: event.abilities?.reduce((prev: any[], next: MonsterAbilityCard) => {
          const count = next?.count ?? 1;
          for (let i = 0; i < count; i++) {
            prev.push({ ...next });
          }
          return prev;
        }, [])
          ?.map((a: any) => ({ ...a })) ?? []
      }
    }),
    monsterAbilityCardDraw: (state, event) => {
      let abilities = [...state.activeMonsters[event]];
      this.drawCard(abilities);

      return {
        ...state,
        activeMonsters: {
          ...state.activeMonsters,
          [event]: abilities
        }
      }
    },
    roundComplete: (state) => ({
      ...state,
      round: ++state.round,
      activeMonsters: {
        ...state.activeMonsters,
        ...Object.entries(state.activeMonsters)
          .reduce((prev, [monsterId, cards]) => {
            // if there are no tokens in play for the monster, don't draw a card
            if (!state.tokens.find(t => t.monsterId.toString() === monsterId)) {
              return prev;
            }

            for (let i = cards.length - 1; i >= 0; i--) {
              if (cards[i].drawn && cards[i].shuffle) {
                this.shuffleArray(cards);
                cards.forEach(c => c.drawn = false);
                break;
              }
            }
            this.drawCard(cards);

            prev[monsterId] = cards;
            return prev;
          }, {} as typeof state.activeMonsters)
      }
    }),
    selectors: {
      round: state => state.round,
      tokens: state => state.tokens,
      activeMonsters: state => state.activeMonsters
    }
  });

  public store = adapt(
    'combat',
    {
      round: 0,
      tokens: [],
      activeMonsters: {}
    } as CombatState,
    this._adapter,
    {
      monsterAbilityCardDraw: this._monsterService.monsterAbilityCardDraw$,
      monsterActivate: this._monsterService.monsterActivate$,
      roundComplete: this.roundComplete$,
      addToken: this.addToken$,
      updateTokenHitPoint: this.updateTokenHitPoint$,
      toggleTokenCondition: this.toggleTokenCondition$
    }
  )

  constructor(
    private _monsterService: MonsterService
  ) {
  }
}
