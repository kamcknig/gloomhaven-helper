import {Directive, ElementRef, Input, OnInit, Renderer2, ViewContainerRef} from '@angular/core';
import {Action} from "../../monster/services/model";
import {StatModifierPipe} from "../../monster/pipes/stat-modifier.pipe";

@Directive({
  selector: '[appActionIcon],appActionIcon',
  standalone: true
})
export class ActionIconDirective implements OnInit {
  private _appAction: Action;

  @Input('appAction')
  public set appAction(value: Action) {
    this._appAction = value;
  };

  @Input('appActionIcon')
  public set appActionIconAction(value: Action) {
    this._appAction = value;
  };

  constructor(
    private _renderer: Renderer2,
    private _el: ElementRef,
    private _vcf: ViewContainerRef,
    private _stateModifier: StatModifierPipe
  ) {
  }

  ngOnInit(): void {
    console.log(this._appAction);
    const divEl: HTMLDivElement = this._renderer.createElement('div');
    this._renderer.addClass(divEl, 'action-wrapper');

    const mainLineDivEl: HTMLDivElement = this._renderer.createElement('div');
    this._renderer.addClass(mainLineDivEl, 'main-line-action-wrapper');

    let actionName: HTMLSpanElement;
    let actionValue: HTMLSpanElement;

    const imgEL: HTMLImageElement = this._renderer.createElement('img');
    switch (this._appAction.action) {
      case 'attack':
        actionName = this._renderer.createElement('span');
        actionName.innerText = 'Attack';
        mainLineDivEl.appendChild(actionName);

        imgEL.src = '/assets/icons/attack.png';
        mainLineDivEl.appendChild(imgEL);

        actionValue = this._renderer.createElement('span');
        actionValue.innerText = this._stateModifier.transform(this._appAction.value);
        mainLineDivEl.appendChild(actionValue);
        break;
    }

    this._appAction.modifiers.forEach(mod => {

    });

    divEl.appendChild(mainLineDivEl);
    this._renderer.setStyle(imgEL, 'display', 'inline-block');
    this._renderer.insertBefore(this._vcf.element.nativeElement.parentElement, divEl, this._el.nativeElement);
  }
}
