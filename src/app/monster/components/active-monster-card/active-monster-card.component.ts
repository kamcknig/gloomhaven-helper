import { Component, Input, OnInit } from '@angular/core';
import { MonsterInfo, MonsterService } from '../../services/monster.service';

@Component({
  selector: 'app-active-monster-card',
  templateUrl: './active-monster-card.component.html',
  styleUrls: ['./active-monster-card.component.scss']
})
export class ActiveMonsterCard implements OnInit {
  @Input() value: MonsterInfo | undefined;

  constructor(
    public monsterService: MonsterService
  ) { }

  ngOnInit(): void {
  }

  getStatDisplayValue(value: number | string | undefined) {
    return value === 0 ? '-' : value;
  }
}
