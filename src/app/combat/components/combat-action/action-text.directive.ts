import {Directive, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import {ActionTextService} from "../../services/action-text.service";
import {Action, ActionModifier} from "../../../monster/services/model";

@Directive({
  selector: '[actionText]',
  standalone: true,
  providers: [ActionTextService]
})
/**
 * Sets the innerHTML property of the host element to the human-readable text
 * on action cards
 */
export class ActionTextDirective implements OnInit {
  @Input('actionText') action: ActionModifier | Action;

  constructor(
    private _elRef: ElementRef,
    private _renderer: Renderer2,
    private _actionTextService: ActionTextService
  ) {
  }

  ngOnInit(): void {
    const txt = this._actionTextService.getActionHtml(this.action)
    this._renderer.setProperty(this._elRef.nativeElement, 'innerHTML', txt);
    /*this._renderer.setProperty()*/

  }
}
