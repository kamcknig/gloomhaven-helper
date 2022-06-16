import { Component, Input, OnInit } from '@angular/core';
import { MonsterInfo, MonsterService } from '../../services/monster.service';
import { AppService } from '../../../app.service';

@Component({
  selector: 'app-active-monster-card',
  templateUrl: './active-monster-card.component.html',
  styleUrls: ['./active-monster-card.component.scss']
})
export class ActiveMonsterCard implements OnInit {
  @Input() value: MonsterInfo | undefined;
  tokens: any[] = [{
    number: 1,
    health: 10
  },{
    number: 1,
    health: 10
  },{
    number: 1,
    health: 10
  },{
    number: 1,
    health: 10
  },{
    number: 1,
    health: 10
  },{
    number: 1,
    health: 10
  },{
    number: 1,
    health: 10
  },{
    number: 1,
    health: 10
  },{
    number: 1,
    health: 10
  },{
    number: 1,
    health: 10
  }];

  constructor(
    public monsterService: MonsterService,
    public appService: AppService
  ) { }

  ngOnInit(): void {
  }

  getStatDisplayValue(value: number | string | undefined) {
    return value || '-';
  }
}
