import {Component, HostBinding, Input} from '@angular/core';
import {CommonModule, TitleCasePipe} from '@angular/common';
import {Action} from "../../../monster/services/model";
import {CombatAction} from "../combat-action/combat-action.component";
import {StatModifierPipe} from "../../../monster/pipes/stat-modifier.pipe";

@Component({
  selector: 'app-combat-actions',
  standalone: true,
  imports: [CommonModule, CombatAction],
  providers: [StatModifierPipe, TitleCasePipe],
  templateUrl: './combat-actions.component.html',
  styleUrls: ['./combat-actions.component.scss']
})
export class CombatActionsComponent {

  @HostBinding('class.combat-actions') public readonly combatActionsClass: boolean = true;

  @Input() public actions: Action[] | undefined;

  constructor() {
  }
}
