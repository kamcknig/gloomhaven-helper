import {Injectable} from '@angular/core';
import {Action, ActionModifier, isAction} from "../../monster/services/model";
import {TitleCasePipe} from "@angular/common";
import {ElementNames} from "../../elements/model";

@Injectable({
  providedIn: 'root'
})
export class ActionTextService {

  constructor(private _titleCasePipe: TitleCasePipe) {
  }
  // immobilize, strengthen, muddle, disarm

  /**
   * Returns a string representation of HTML that can be used with the innerHTML
   * property of a HTML element
   *
   * @param action
   */
  getActionHtml = (action: Action | ActionModifier): string => {
    const actionName: string = isAction(action) ? action.action : action.modifier;
    switch (actionName) {
      case 'html':
        return (action as any)[actionName];
      case 'immobilize':
      case 'poison':
      case 'wound':
      case 'stun':
      case 'strengthen':
      case 'muddle':
      case 'invisible':
      case 'disarm':
      case 'curse':
      case 'bless':
        return this._titleCasePipe.transform(actionName);
      case 'infuse':
        return ((action as any)[actionName] as ElementNames[]).reduce(
          (prev, next) => prev.concat(`<img class="icon element infuse" src="/assets/icons/element-${next}.png" />`),
          ''
        );
      default:
        return `${this._titleCasePipe.transform(actionName)} ${(action as any)[actionName]}`;
    }
  }
}
