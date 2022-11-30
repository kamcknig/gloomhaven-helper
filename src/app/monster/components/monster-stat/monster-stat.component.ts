import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttackEffect, Bonus, Condition } from "../../services/model";

@Component({
  selector: 'app-monster-stat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './monster-stat.component.html',
  styleUrls: ['./monster-stat.component.scss']
})
export class MonsterStatComponent {
  get conditionAmount(): number | [number, number] | undefined {
    return this._conditionAmount;
  }

  @Input() set conditionAmount(value: number | [number, number] | undefined) {
    this._conditionAmount = value;
    console.log(this._conditionAmount);
  }
  @Input() condition: AttackEffect | Bonus | Condition;

  /**
   * The associated value that goes with the condition if any
    */
  private _conditionAmount: number | [number, number] | undefined;

  constructor() { }

  showAdditionalConditionEffectInfo(condition: typeof this.condition) {
    return ['retaliate', 'pierce', 'pull', 'push', 'shield', 'target'].includes(condition);
  }
}
