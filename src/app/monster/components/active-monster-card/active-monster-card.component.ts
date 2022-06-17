import { Component, Input, OnInit } from '@angular/core';
import { MonsterInfo, MonsterService } from '../../services/monster.service';
import { AppService } from '../../../app.service';
import { TokenService } from '../../../token/services/token.service';
import { DialogService } from 'primeng/dynamicdialog';
import { AddTokenDialogComponent } from './add-token-dialog/add-token-dialog.component';

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
    public tokenService: TokenService,
    private _dialogService: DialogService
  ) { }

  ngOnInit(): void {

  }

  getStatDisplayValue(value: number | string | undefined) {
    return value || '-';
  }

  addToken() {
    const ref = this._dialogService.open(AddTokenDialogComponent, {
      closeOnEscape: true,
      modal: true
    });
    this.tokenService.addToken$.next({ number: 2, maxHealth: 25 })
  }
}
