import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActionIconDirective} from "../../directives/action-icon.directive";
import {Action} from "../../../monster/services/model";

@Component({
  selector: 'app-combat-action',
  standalone: true,
  imports: [CommonModule, ActionIconDirective],
  templateUrl: './combat-action.component.html',
  styleUrls: ['./combat-action.component.scss']
})
export class CombatActionComponent implements OnInit {
  @Input() public action: Action;

  constructor() { }

  ngOnInit(): void {
  }

}
