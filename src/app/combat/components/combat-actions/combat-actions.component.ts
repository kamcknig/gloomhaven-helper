import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CombatActionComponent} from "../combat-action/combat-action.component";
import {MobAction} from "../../../monster/services/model";

@Component({
  selector: 'app-combat-actions',
  standalone: true,
  imports: [CommonModule, CombatActionComponent],
  templateUrl: './combat-actions.component.html',
  styleUrls: ['./combat-actions.component.scss']
})
export class CombatActionsComponent implements OnInit {

  @HostBinding('class.combat-actions') public readonly combatActionsClass: boolean = true;

  @Input() public actions: MobAction[] = [{ attack: '+1', range: '+1'}, { attack: '-1', range: '+1'}, { attack: '+1', range: '-1'}];

  constructor() { }

  ngOnInit(): void {
  }

}
