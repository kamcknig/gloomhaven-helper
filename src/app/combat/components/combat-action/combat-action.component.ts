import {Component, Input, OnInit} from '@angular/core';
import {CommonModule, TitleCasePipe} from '@angular/common';
import {ActionDirective} from "../../directives/action.directive";
import {Action} from "../../../monster/services/model";
import {StatModifierPipe} from "../../../monster/pipes/stat-modifier.pipe";

@Component({
  selector: 'app-combat-action',
  standalone: true,
  imports: [CommonModule, ActionDirective],
  providers: [
    StatModifierPipe,
    TitleCasePipe
  ],
  templateUrl: './combat-action.component.html',
  styleUrls: ['./combat-action.component.scss']
})
export class CombatActionComponent implements OnInit {
  @Input() public action: Action;

  constructor() { }

  ngOnInit(): void {
  }

}
