import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {Action, ActionNames} from "../../../monster/services/model";
import {CommonModule} from "@angular/common";
import {ActionTextDirective} from "../../directives/action-text.directive";

@Component({
  templateUrl: './combat-action.component.html',
  selector: 'app-combat-action',
  imports: [CommonModule, ActionTextDirective],
  standalone: true,
  styleUrls: ['./combat-action.component.scss']
})
export class CombatAction implements OnInit {
  @HostBinding('class.combat-action') public readonly combatActionClass: boolean = true;

  @Input() public action: Action;

  public actionClass: { [p in ActionNames]?: boolean };

  constructor(
  ) {
  }

  ngOnInit(): void {
    console.log(this.action);
    this.actionClass = { [this.action.action]: true };
  }
}
