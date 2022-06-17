import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AppService } from './app.service';
import { MonsterInfo, MonsterService } from './monster/services/monster.service';
import { take } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';

export type AppMenuItem<T = any> = MenuItem & { metadata?: T };

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'gloomhaven-helper';

  dockModel: AppMenuItem<MonsterInfo>[] = [
    {
      label: 'Test',
      tooltipOptions: {
        tooltipLabel: 'Add monster',
        tooltipPosition: 'top',
        showDelay: 300,
        positionLeft: 20
      }
    },
    {
      label: 'Add monster',
      icon: 'assets/monster-ability-cards/monster-ability-card-back.jpg',
      command: (...args: any[]) => {
        let monster: MonsterInfo = {} as MonsterInfo;
        this.monsterService.monsterStore['monsters$'].pipe(take(1)).subscribe(
          (m: MonsterInfo[]) => {
            monster = m[Math.floor(Math.random() * m.length)];
          })
        this.monsterService.activateMonster$.next(monster)
      },
      tooltipOptions: {
        tooltipLabel: 'Add monster',
        tooltipPosition: 'top',
        showDelay: 300,
        positionLeft: 20
      }
    }
  ];

  constructor(
    public appService: AppService,
    public monsterService: MonsterService,
    private _dialogService: DialogService
  ) {

  }

  ngOnInit(): void {

  }
}
