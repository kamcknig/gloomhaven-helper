import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';
import { MonsterInfo, MonsterService } from './monster/services/monster.service';
import { map, Subject, take, takeUntil } from 'rxjs';
import { ActivateMonsterDialogComponent } from './monster/activate-monster-dialog/activate-monster-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private _destroy$: Subject<void> = new Subject<void>();

  title = 'gloomhaven-helper';
  levelInputControl = new FormControl('');

  public activateMonster(...args: any[]): void {
    this._dialogService.open(ActivateMonsterDialogComponent, {
      disableClose: false,
      autoFocus: false
    })
      .afterClosed()
      .subscribe({
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
    private _dialogService: MatDialog
  ) {

  }

  ngOnInit(): void {
    this.appService.scenarioStore.level$.pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (value) => {
          this.levelInputControl.setValue(value.toString());
        }
      })
  }
}
