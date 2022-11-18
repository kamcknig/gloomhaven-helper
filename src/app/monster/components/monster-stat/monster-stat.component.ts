import {Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ConditionAndEffectTypes} from "../../services/model";

@Component({
  selector: 'app-monster-stat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './monster-stat.component.html',
  styleUrls: ['./monster-stat.component.scss']
})
export class MonsterStatComponent {
  @Input() condition: ConditionAndEffectTypes;

  /**
   * The associated value that goes with the condition if any
    */
  @Input() conditionAmount: number | [number, number] | undefined;

  constructor() { }

  showAdditionalConditionEffectInfo(condition: ConditionAndEffectTypes) {
    return ['Retaliate', 'Pierce', 'Pull', 'Shield', 'Target'].includes(condition);
  }
}
