import { Injectable } from '@angular/core';
import { AdaptCommon, createAdapter, createSelectors, Source } from '@state-adapt/core';

export interface TokenInfo {
  health?: number;
  maxHealth: number;
  number: number;
  monsterId: number | undefined;
  elite?: boolean;
  appliedConditionsAndEffects?: {
    [key: string]: number;
  }
}

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  public addToken$: Source<TokenInfo> = new Source('addToken$');
  public updateTokenHitPoint$: Source<[TokenInfo, number]> = new Source('updateTokenHitPoint$');
  public toggleTokenStatus$: Source<{ token: TokenInfo, condition: string }> = new Source(
    'toggleTokenStatus$')

  private _tokenAdapter = createAdapter<TokenInfo[]>()({
    addToken: (state, event, initialState) => [...state, event],
    updateTokenHitPoint: (state, event: [TokenInfo, number], initialState) => {
      const newState = [...state];
      const idx = newState.findIndex(t => t.monsterId === event[0].monsterId && t.number === event[0].number);
      if (idx === -1) {
        return state;
      }
      const token = newState[idx];
      newState.splice(idx, 1, { ...token, health: event[1] });

      if ((newState[idx].health ?? 0) < 1) {
        newState.splice(idx, 1);
      }

      return newState;
    },
    selectors: createSelectors<TokenInfo[]>()({
      tokens: s => s
    }),
    toggleTokenStatus: (state, { token, condition }, initialState) => {
      const newState = [...state];
      const idx = newState.findIndex(t => t.monsterId === token.monsterId && t.number === token.number);
      if (idx === -1) {
        return state;
      }
      const newToken = newState[idx];
      newState.splice(
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

      return newState;
    }
  });

  public tokenStore = this._adapt.init(
    ['tokens', this._tokenAdapter, []],
    {
      addToken: this.addToken$,
      updateTokenHitPoint: this.updateTokenHitPoint$,
      toggleTokenStatus: this.toggleTokenStatus$
    }
  )

  constructor(private _adapt: AdaptCommon<any>) {
  }
}
