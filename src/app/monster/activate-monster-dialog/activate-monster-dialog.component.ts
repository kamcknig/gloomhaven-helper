import { Component, OnInit } from '@angular/core';
import { MonsterInfo, MonsterService } from '../services/monster.service';
import { joinSelectors } from '@state-adapt/core';
import { concatMap, of, tap } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-activate-monster-dialog',
  templateUrl: './activate-monster-dialog.component.html',
  styleUrls: ['./activate-monster-dialog.component.scss']
})
export class ActivateMonsterDialogComponent implements OnInit {
  searchResults: MonsterInfo[] = [];
  selected: MonsterInfo | undefined;
  availableMonsters: MonsterInfo[] = [];

  constructor(
    private _monsterService: MonsterService,
    private _dialogRef: MatDialogRef<any>
  ) {
  }

  ngOnInit(): void {
    joinSelectors(
      this._monsterService.monsterStore,
      this._monsterService.activeMonsterStore,
      (monsters, activeMonsters) => {
        return monsters.reduce((prev, next) => {
          if (activeMonsters.find(a => a.id === next.id)) {
            return prev;
          }
          prev.push(next);
          return prev;
        }, [] as MonsterInfo []);
      }
    )
      .state$
      .pipe(
        concatMap((value, index) => index === 0 ? of(value).pipe(tap(value => this.selected = value[0])) : of(value))
      )
      .subscribe({
          next: value => {
            this.availableMonsters = value;
          }
        }
      );
  }

  search($event: any) {
    let query = $event.query as string;
    if (!query) {
      this.searchResults = this.availableMonsters.concat();
      return;
    }

    query = query.replace(/\s/g, '');
    this.searchResults = this.availableMonsters.filter(
      e => new RegExp(`${query}`, 'gi').test(e.name.replace(/\s/g, ''))
    );
  }

  selectMonster($event: any) {
    this.selected = $event;
  }

  close(value: any) {
    this._dialogRef.close(value);
  }
}
