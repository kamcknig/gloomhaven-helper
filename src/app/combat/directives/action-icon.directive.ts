import {Directive, ElementRef, Input, OnInit, Renderer2, ViewContainerRef} from '@angular/core';
import {Action} from "../../monster/services/model";
import {StatModifierPipe} from "../../monster/pipes/stat-modifier.pipe";
import {TitleCasePipe, UpperCasePipe} from "@angular/common";

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
    private _statModifierPipe: StatModifierPipe,
    private _titleCasePipe: TitleCasePipe
  ) {
  }

  ngOnInit(): void {
    console.log(this._appAction);
    const divEl: HTMLDivElement = this._renderer.createElement('div');
    this._renderer.addClass(divEl, 'action-wrapper');

    const mainLineDivEl: HTMLDivElement = this._renderer.createElement('div');
    this._renderer.addClass(mainLineDivEl, `main-line-action-wrapper`);
    this._renderer.addClass(mainLineDivEl, this._appAction.action);
    this._renderer.setStyle(mainLineDivEl, 'white-space', 'pre-wrap');

    let actionNameEl: HTMLSpanElement;
    let actionValueEl: HTMLSpanElement

    switch (this._appAction.action) {
      case 'text':
        break;
      default:
        actionNameEl = this._renderer.createElement('span');
        actionNameEl.textContent = this._titleCasePipe.transform(this._appAction.action);
        mainLineDivEl.appendChild(actionNameEl);

        actionValueEl = this._renderer.createElement('span');
        actionValueEl.textContent = `  ${this._statModifierPipe.transform(this._appAction.value)}  `;
        mainLineDivEl.appendChild(actionValueEl);

        const imgEL: HTMLImageElement = this._renderer.createElement('img');
        this._renderer.setStyle(imgEL, 'display', 'inline-block');
        imgEL.src = `/assets/icons/${this._appAction.action}.png`;
        mainLineDivEl.appendChild(imgEL);

        divEl.appendChild(mainLineDivEl);
    }

    this._appAction.modifiers?.forEach(mod => {
      const modifierLineDivEl: HTMLDivElement = this._renderer.createElement('div');
      this._renderer.addClass(modifierLineDivEl, 'action-modifier-wrapper');

      const modNameEl: HTMLSpanElement = this._renderer.createElement('span');
      const [[modName, modValue]] = Object.entries(mod);
      modNameEl.textContent = this._titleCasePipe.transform(modName);
      modifierLineDivEl.appendChild(modNameEl);

      const imgEl = this._renderer.createElement('img');
      this._renderer.setStyle(imgEl, 'display', 'inline-block');

      divEl.appendChild(modifierLineDivEl);
    });

    this._renderer.insertBefore(this._vcf.element.nativeElement.parentElement, divEl, this._el.nativeElement);
  }
}
