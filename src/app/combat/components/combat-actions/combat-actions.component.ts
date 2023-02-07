import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {CommonModule, TitleCasePipe} from '@angular/common';
import {Action} from "../../../monster/services/model";
import {ActionDirective} from "../../directives/action.directive";
import {StatModifierPipe} from "../../../monster/pipes/stat-modifier.pipe";

@Component({
  selector: 'app-combat-actions',
  standalone: true,
  imports: [CommonModule, ActionDirective],
  providers: [StatModifierPipe, TitleCasePipe],
  templateUrl: './combat-actions.component.html',
  styleUrls: ['./combat-actions.component.scss']
})
export class CombatActionsComponent implements OnInit {

  @HostBinding('class.combat-actions') public readonly combatActionsClass: boolean = true;

  @Input() public actions: Action[] | undefined;

  constructor() {
  }

  ngOnInit(): void {
  }

}
