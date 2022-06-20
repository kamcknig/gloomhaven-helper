import { Injectable } from '@angular/core';
import { AdaptCommon, createAdapter, createSelectors, Source } from '@state-adapt/core';
import { AppliedConditions } from '../../monster/services/monster.service';

export interface TokenInfo {
  health?: number;
  maxHealth: number;
  number: number;
  monsterId: number | undefined;
  elite?: boolean;
  appliedConditionsAndEffects?: AppliedConditions
}

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  public addToken$: Source<TokenInfo> = new Source<TokenInfo>('addToken$');
  public updateTokenHitPoint$: Source<[TokenInfo, number]> = new Source<[TokenInfo, number]>('updateTokenHitPoint$');

  private _tokenAdapter = createAdapter<TokenInfo[]>()({
    addToken: (state, event, initialState) => [...state, event],
    updateTokenHitPoint: (state, event: [TokenInfo, number], initialState) => {
      const newState = [...state];
      const idx = newState.findIndex(t => t.monsterId === event[0].monsterId && t.number === event[0].number);
      if (idx === -1) {
        return state;
      }
      const token = newState[idx];
      newState.splice(idx, 1, { ...token, health: (token?.health ?? token.maxHealth) + event[1] });

      if ((newState[idx].health ?? 0) < 1) {
        newState.splice(idx, 1);
      }

      return newState;
    },
    selectors: createSelectors<TokenInfo[]>()({
      tokens: s => s
    })
  });
  public tokenStore = this._adapt.init(
    ['tokens', this._tokenAdapter, []],
    {
      addToken: this.addToken$,
      updateTokenHitPoint: this.updateTokenHitPoint$
    }
  )
  constructor(private _adapt: AdaptCommon<any>) {
  }
}
