import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AppService } from './app.service';
import { MonsterInfo, MonsterService } from './monster/services/monster.service';
import { map, take } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { ActivateMonsterDialogComponent } from './monster/activate-monster-dialog/activate-monster-dialog.component';

export type AppMenuItem<T = any> = MenuItem & { metadata?: T };

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'gloomhaven-helper';

  toolbarButtons: AppMenuItem<MonsterInfo>[] = [
    {
      label: 'Add monster',
      command: this.activateMonster.bind(this),
      tooltipOptions: {
        tooltipLabel: 'Add monster',
        tooltipPosition: 'top',
        showDelay: 300,
        positionLeft: 20
      }
    }
  ];

  public activateMonster(...args: any[]): void {
    this._dialogService.open(ActivateMonsterDialogComponent, {
      modal: true,
      closeOnEscape: true,
      header: "Select a monster"
    }).onClose.subscribe({
      next: id => {
        let monster: MonsterInfo | undefined;
        this.monsterService.monsterStore.monsters$
          .pipe(
            map(monsters => monsters.find(m => m.id === id)),
            take(1)
          )
          .subscribe({
            next: (value) => monster = value
          });

        if (!monster) {
          console.warn(`Monster ${id} not found in store`);
          return;
        }
        this.monsterService.activateMonster$.next(monster);
      }
    });
  }

  constructor(
    public appService: AppService,
    public monsterService: MonsterService,
    private _dialogService: DialogService
  ) {

  }

  ngOnInit(): void {

  }
}
