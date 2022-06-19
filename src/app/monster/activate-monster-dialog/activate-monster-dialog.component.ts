import { Component, OnInit } from '@angular/core';
import { MonsterInfo, MonsterService } from '../services/monster.service';
import { joinSelectors } from '@state-adapt/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-activate-monster-dialog',
  templateUrl: './activate-monster-dialog.component.html',
  styleUrls: ['./activate-monster-dialog.component.scss']
})
export class ActivateMonsterDialogComponent implements OnInit {
  searchResults: MonsterInfo[] = [];
  selected: string | undefined;
  availableMonsters: MonsterInfo[] | undefined;

  constructor(
    private _monsterService: MonsterService,
    private _dialogRef: DynamicDialogRef
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
        }, [] as MonsterInfo[]);
      }).state$.subscribe({
        next: value => {
          console.log(value);
          this.availableMonsters = value;
        }
      }
    );
  }

  search($event: any) {
    const query = $event.query as string;
    if (!query) {
      this.searchResults = this.availableMonsters!.concat();
      return;
    }
  }

  selectMonster($event: any) {
    console.log($event);
  }
}
