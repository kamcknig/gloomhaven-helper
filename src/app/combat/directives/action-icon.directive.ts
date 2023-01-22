import {Directive, ElementRef, Input, OnInit, Renderer2, ViewContainerRef} from '@angular/core';
import {Action} from "../../monster/services/model";

@Directive({
  selector: '[appActionIcon],appActionIcon',
  standalone: true
})
export class ActionIconDirective implements OnInit {
  private _appAction: Action;

  private _mainActions: string[] = [
    'move',
    'attack'
  ];

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
    private _vcf: ViewContainerRef
  ) {
  }

  ngOnInit(): void {
    console.log(this._appAction);
    const divEl: HTMLDivElement = this._renderer.createElement('div');
    let actionName: HTMLSpanElement;

    const imgEL: HTMLImageElement = this._renderer.createElement('img');
    switch (this._appAction.action) {
      case 'attack':

        actionName = this._renderer.createElement('span');
        actionName.innerText = 'Attack';

        imgEL.src = '/assets/icons/attack.png';
        break;
    }

    this._renderer.setStyle(imgEL, 'display', 'inline-block');
    this._renderer.insertBefore(this._vcf.element.nativeElement.parentElement, imgEL, this._el.nativeElement);
  }
}
