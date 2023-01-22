import {
  ComponentFactoryResolver,
  Directive,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewContainerRef
} from '@angular/core';
import {MobAction, StatModifier} from "../../monster/services/model";

@Directive({
  selector: '[appActionIcon],appActionIcon',
  standalone: true
})
export class ActionIconDirective implements OnInit {
  private _appAction: MobAction;

  private _mainActions: string[] = [
    'move',
    'attack'
  ];

  @Input('appAction')
  public set appAction(value: MobAction) {
    this._appAction = value;
  };

  @Input('appActionIcon')
  public set appActionIconAction(value: MobAction) {
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
    const imgEL: HTMLImageElement = this._renderer.createElement('img');
    Object.keys(this._appAction).find(actionName => this._mainActions.includes(actionName))
    switch (Object.keys(this._appAction)[0]) {
      case 'attack':
        imgEL.src = '/assets/icons/attack.png';
        break;
    }

    this._renderer.setStyle(imgEL, 'display', 'inline-block');
    this._renderer.insertBefore(this._vcf.element.nativeElement.parentElement, imgEL, this._el.nativeElement);
  }
}

export type ActionAttack = {
  attack: MobAction['attack'];
  range?: MobAction['range'];
  'info-text'?: MobAction['info-text'];
}
