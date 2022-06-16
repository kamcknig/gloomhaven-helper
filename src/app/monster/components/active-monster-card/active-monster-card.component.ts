import { Component, Input, OnInit } from '@angular/core';
import { MonsterInfo, MonsterService } from '../../services/monster.service';
import { AppService } from '../../../app.service';
import { TokenInfo, TokenService } from '../../../token/services/token.service';
import { Token } from '@angular/compiler';

@Component({
  selector: 'app-active-monster-card',
  templateUrl: './active-monster-card.component.html',
  styleUrls: ['./active-monster-card.component.scss']
})
export class ActiveMonsterCard implements OnInit {
  @Input() value: MonsterInfo | undefined;

  constructor(
    public monsterService: MonsterService,
    public appService: AppService,
    public tokenService: TokenService
  ) { }

  ngOnInit(): void {
  }

  getStatDisplayValue(value: number | string | undefined) {
    return value || '-';
  }
}
