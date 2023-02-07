import {Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewContainerRef} from '@angular/core';
import {Action} from "../../monster/services/model";
import {StatModifierPipe} from "../../monster/pipes/stat-modifier.pipe";
import {TitleCasePipe} from "@angular/common";

@Directive({
  selector: 'appAction,[appAction]',
  standalone: true
})
export class ActionDirective implements OnInit, OnDestroy {
  private _appAction: Action;

  private _addedEl: HTMLDivElement;

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
    this._addedEl = this._renderer.createElement('div');
    this._renderer.addClass(this._addedEl, 'action-wrapper');

    const mainLineDivEl: HTMLDivElement = this._renderer.createElement('div');
    this._renderer.addClass(mainLineDivEl, `main-line-action-wrapper`);
    this._renderer.addClass(mainLineDivEl, this._appAction.action);

    let actionTextEl: HTMLSpanElement = this._renderer.createElement('span');
    let actionValueEl: HTMLSpanElement

    switch (this._appAction.action) {
      case 'text':
        actionTextEl.innerHTML = this._appAction.value as string;
        mainLineDivEl.appendChild(actionTextEl);
        break;
      default:
        actionTextEl.innerHTML = this._titleCasePipe.transform(this._appAction.action);
        mainLineDivEl.appendChild(actionTextEl);

        if (this._appAction.value) {
          actionValueEl = this._renderer.createElement('span');
          actionValueEl.innerHTML = `&nbsp;&nbsp;${this._statModifierPipe.transform(this._appAction.value)}&nbsp;&nbsp;`;
          mainLineDivEl.appendChild(actionValueEl);
        }

        if (this._appAction.action) {
          const imgEL: HTMLImageElement = this._renderer.createElement('img');
          this._renderer.setStyle(imgEL, 'display', 'inline-block');
          imgEL.src = `/assets/icons/${this._appAction.action}.png`;
          mainLineDivEl.appendChild(imgEL);
        }
    }

    this._addedEl.appendChild(mainLineDivEl);

    this._appAction.modifiers?.forEach(mod => {
      const modifierLineDivEl: HTMLDivElement = this._renderer.createElement('div');
      this._renderer.addClass(modifierLineDivEl, 'action-modifier-wrapper');

      const modNameEl: HTMLSpanElement = this._renderer.createElement('span');
      const [[modName, modValue]] = Object.entries(mod);
      modNameEl.textContent = this._titleCasePipe.transform(modName);
      modifierLineDivEl.appendChild(modNameEl);

      const imgEl = this._renderer.createElement('img');
      this._renderer.setStyle(imgEl, 'display', 'inline-block');

      this._addedEl.appendChild(modifierLineDivEl);
    });

    this._renderer.appendChild(this._vcf.element.nativeElement.parentElement, this._addedEl);
  }

  ngOnDestroy() {
    this._addedEl && this._renderer.removeChild(this._vcf.element.nativeElement.parentElement, this._addedEl);
  }
}
