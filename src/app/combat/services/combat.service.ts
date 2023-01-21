import {Injectable} from '@angular/core';
import {buildAdapter, createAdapter} from '@state-adapt/core';
import {MonsterService} from '../../monster/services/monster.service';
import {adapt} from '@state-adapt/angular';
import {isBoss, Mob, MonsterAbility, MonsterId} from '../../monster/services/model';
import {CombatState, TokenInfo} from './model';
import {Source} from '@state-adapt/rxjs';

@Injectable({
  providedIn: 'root'
})
export class CombatService {
  public nextTurn$: Source<void> = new Source<void>('nextTurn$');
  public previousTurn$: Source<void> = new Source<void>('previousTurn$');
  public toggleTokenElite$ = new Source<TokenInfo[] | TokenInfo>('toggleTokenElite$');
  public roundComplete$ = new Source<void>('roundCompleted$');
  public addToken$: Source<TokenInfo[] | TokenInfo> = new Source('addToken$');
  public updateTokenHitPoint$: Source<[TokenInfo, number]> = new Source('updateTokenHitPoint$');
  public toggleTokenCondition$: Source<{ token: TokenInfo, condition: string }> = new Source(
    'toggleTokenCondition$');

  /**
   * Shuffles an Array and returns a NEW Array of the shuffled elements
   * @param src
   */
  private shuffleArray = <T>(src: T[]): T[] => {
    const out = src.concat();
    for (let i = out.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = out[i];
      out[i] = out[j];
      out[j] = temp;
    }
    return out;
  }

  private _combatAdapter = createAdapter<CombatState>()({
    toggleTokenElite: (state, event: TokenInfo | TokenInfo[]) => {
      const toggleTokens = Array.isArray(event) ? event : [event];

      return {
        ...state,
        tokens: [
          ...state.tokens.map(t => ({
            ...t,
            elite: toggleTokens.find(tt => tt.monsterId === t.monsterId && tt.number === t.number) ? !t.elite : t.elite
          }))
        ]
      };
    },
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
      tokens.splice(idx, 1, {...token, health: event[1]});

      if ((tokens[idx].health ?? 0) < 1) {
        tokens.splice(idx, 1);
      }

      return {
        ...state,
        tokens: [...tokens]
      }
    },
    toggleTokenCondition: (state, {token, condition}) => {
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
    deactivateMonster: (state, monster: Mob) => {
      const {[monster.id]: removed, ...activeMonsters} = state.activeMonsters;
      return {
        ...state,
        tokens: [...state.tokens.filter(t => t.monsterId !== monster.id)],
        activeMonsters,
        turn: Math.min(state.turn, Object.keys(activeMonsters).length)
      }
    },
    activateMonster: (state, event: Mob) => {
      const abilities = event.abilities?.reduce((prev: any[], next: MonsterAbility) => {
          const count = next?.count ?? 1;
          for (let i = 0; i < count; i++) {
            prev.push({...next});
          }
          return prev;
        }, [])
        ?.map((a: any) => ({...a})) ?? [];

      this.shuffleArray(abilities);

      return {
        ...state,
        activeMonsters: {
          ...state.activeMonsters,
          [event.id]: {
            id: event.id,
            boss: isBoss(event) ? event.boss : false,
            abilities,
            name: event.name
          }
        }
      };
    },
    monsterAbilityCardDraw: (state, event: MonsterId) => {
      const combatMob = state.activeMonsters[event];
      let newCard = isNaN(combatMob.card) ? 0 : combatMob.card + 1;
      let abilities = combatMob.abilities;

      if (newCard >= combatMob.abilities.length) {
        abilities = this.shuffleArray(combatMob.abilities);
        newCard = 0;
      }

      return {
        ...state,
        activeMonsters: {
          ...state.activeMonsters,
          [event]: {
            ...state.activeMonsters[event],
            card: newCard,
            abilities
          }
        }
      }
    },
    roundComplete: (state) => ({
      ...state,
      turn: state.tokens.length ? 1 : 0,
      round: ++state.round,
      activeMonsters: {
        ...state.activeMonsters,
        ...Object.entries(state.activeMonsters)
          .reduce((prev, [monsterId, monster]) => {
            // if there are no tokens in play for the monster, don't draw a card
            if (!state.activeMonsters[monsterId].boss && !state.tokens.find(t => t.monsterId.toString() === monsterId)) {
              return prev;
            }

            let newCard = isNaN(monster.card) ? 0 : monster.card + 1;
            let abilities = monster.abilities;
            if ((!isNaN(monster.card) && abilities[monster.card].shuffle) || newCard >= monster.abilities.length) {
              abilities = this.shuffleArray(abilities);
              newCard = 0;
            }

            prev[monsterId] = {
              ...monster,
              abilities,
              initiative: abilities[newCard].initiative,
              card: newCard
            };

            return prev;
          }, {} as typeof state.activeMonsters)
      }
    }),
    nextTurn: (state) => {
      return {
        ...state,
        turn: Math.min(++state.turn, Object.keys(state.activeMonsters ?? {}).length)
      };
    },
    previousTurn: (state) => {
      return {
        ...state,
        turn: Math.max(--state.turn, 1)
      };
    },
    selectors: {
      round: state => state.round,
      tokens: state => state.tokens,
      activeMonsters: state => state.activeMonsters,
      sortedMonsters: state => Object.values(state.activeMonsters)
        .sort((mob1, mob2) => {
          const m1Initiative = mob1.initiative;
          const m2Initiative = mob2.initiative;

          if (m1Initiative === undefined && m2Initiative === undefined) {
            if (mob1.name < mob2.name) {
              return -1;
            } else if (mob2.name > mob1.name) {
              return 1;
            } else {
              return 0;
            }
          }

          if (m1Initiative === undefined) {
            return 1;
          }

          if (m2Initiative === undefined) {
            return -1;
          }

          return m1Initiative - m2Initiative;
        }),
      turn: state => state.turn
    }
  });

  private _actionAdapter = buildAdapter<CombatState>()(this._combatAdapter)({
    actions: s => {
      console.log(Object.values(s.sortedMonsters));
      const monster = Object.values(s.sortedMonsters)?.[s.turn - 1] as CombatState['activeMonsters'][string];
      return monster?.abilities?.[monster.card]?.actions ?? [];
    }
  })();

  public store = adapt(
    [
      'combat',
      {
        round: 0,
        turn: 0,
        tokens: [],
        activeMonsters: {}
      } as CombatState,
      this._actionAdapter
    ],
    {
      monsterAbilityCardDraw: this._monsterService.monsterAbilityCardDraw$,
      activateMonster: this._monsterService.activateMonster$,
      deactivateMonster: this._monsterService.deactivateMonster$,
      roundComplete: this.roundComplete$,
      addToken: this.addToken$,
      updateTokenHitPoint: this.updateTokenHitPoint$,
      toggleTokenCondition: this.toggleTokenCondition$,
      toggleTokenElite: this.toggleTokenElite$,
      nextTurn: this.nextTurn$,
      previousTurn: this.previousTurn$
    }
  );

  constructor(
    private _monsterService: MonsterService
  ) {
  }
}
