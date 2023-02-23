import {Injectable} from '@angular/core';
import {Action, ActionModifier, isAction} from "../../monster/services/model";
import {TitleCasePipe} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class ActionTextService {

  constructor(private _titleCasePipe: TitleCasePipe) {
  }

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
        return action[actionName];
      default:
        return `${this._titleCasePipe.transform(actionName)} ${action[actionName]}`;
    }
  }
}
