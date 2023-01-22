import {Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MobAction} from "../../../monster/services/model";
import {ActionIconDirective} from "../../directives/action-icon.directive";

@Component({
  selector: 'app-combat-action',
  standalone: true,
  imports: [CommonModule, ActionIconDirective],
  templateUrl: './combat-action.component.html',
  styleUrls: ['./combat-action.component.scss']
})
export class CombatActionComponent implements OnInit {
  @Input() public action: MobAction;

  constructor() { }

  ngOnInit(): void {
  }

}
