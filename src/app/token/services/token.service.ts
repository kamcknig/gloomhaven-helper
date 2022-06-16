import { Injectable } from '@angular/core';
import { AdaptCommon, createAdapter, createSelectors, Source } from '@state-adapt/core';

export interface TokenInfo {
  maxHealth: number;
  number: number;
}

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  public addToken$: Source<TokenInfo> = new Source<TokenInfo>('addToken$');
  private _tokenAdapter = createAdapter<TokenInfo[]>()({
    addToken: (state, event, initialState) => [...state, event],
    selectors: createSelectors<TokenInfo[]>()({
      tokens: s => s
    })
  });
  public tokenStore = this._adapt.init(
    ['tokens', this._tokenAdapter, []],
    {
      addToken: this.addToken$
    }
  )
  constructor(private _adapt: AdaptCommon<any>) {
  }
}
