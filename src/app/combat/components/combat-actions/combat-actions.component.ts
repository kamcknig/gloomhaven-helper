import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CombatActionComponent} from "../combat-action/combat-action.component";
import {Action} from "../../../monster/services/model";

@Component({
  selector: 'app-combat-actions',
  standalone: true,
  imports: [CommonModule, CombatActionComponent],
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
