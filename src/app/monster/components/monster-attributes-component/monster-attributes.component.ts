import {Component, Input} from '@angular/core';
import {Monster} from '../../services/model';
import {MonsterStatPipe} from '../../pipes/monster-stat.pipe';

@Component({
  selector: 'app-monster-attributes',
  templateUrl: './monster-attributes.component.html',
  styleUrls: ['./monster-attributes.component.scss'],
  standalone: true,
  imports: [
    MonsterStatPipe
  ]
})
/**
 * Displays a {@link Monster}s attribute icons and values
 */
export class MonsterAttributesComponent {
  @Input() monster: Monster;

  @Input() level: number;

  @Input() index: number;

  constructor() {
  }
}
