import { Component, Input } from '@angular/core';
import { Monster } from '../../services/model';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MonsterStatePipePipe } from '../../pipes/monster-stat.pipe';

@Component({
  selector: 'app-monster-stats',
  templateUrl: './monster-stats.component.html',
  styleUrls: ['./monster-stats.component.scss'],
  standalone: true,
  imports: [
    FlexLayoutModule,
    MonsterStatePipePipe
  ]
})
export class MonsterStatsComponent {
  @Input() monster: Monster;

  @Input() level: number;

  @Input() index: number;

  constructor() {
  }
}