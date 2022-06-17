import { Injectable } from '@angular/core';
import { AdaptCommon, createAdapter, createSelectors, Source } from '@state-adapt/core';

export interface TokenInfo {
  health?: number;
  maxHealth: number;
  number: number;
  monsterId: number | undefined;
  elite?: boolean;
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
      console.log(event);
      return state;
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
