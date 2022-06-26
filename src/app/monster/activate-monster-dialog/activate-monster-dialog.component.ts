import { Component, OnInit } from '@angular/core';
import { MonsterInfo, MonsterService } from '../services/monster.service';
import { joinSelectors } from '@state-adapt/core';
import { concatMap, map, Observable, of, startWith, tap, withLatestFrom } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-activate-monster-dialog',
  templateUrl: './activate-monster-dialog.component.html',
  styleUrls: ['./activate-monster-dialog.component.scss']
})
export class ActivateMonsterDialogComponent implements OnInit {
  public availableMonsters$: Observable<MonsterInfo[]> | undefined;
  public filteredAvailableMonsters$: Observable<MonsterInfo[]> | undefined;
  public monsterInputControl: FormControl = new FormControl('');

  constructor(
    private _monsterService: MonsterService,
    private _dialogRef: MatDialogRef<any>
  ) {
  }

  ngOnInit(): void {
    this.availableMonsters$ = joinSelectors(
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
        concatMap((value, index) =>
          index === 0
            ? of(value).pipe(tap(value => this.monsterInputControl.setValue(value[0])))
            : of(value))
      );

    this.filteredAvailableMonsters$ = this.monsterInputControl.valueChanges.pipe(
      startWith(undefined),
      map(value => typeof value === 'string' ? value : value?.name ?? ''),
      withLatestFrom(this.availableMonsters$),
      map(([value, monsters]) => monsters.filter(m => {
        return new RegExp(`${value.toLowerCase()}`, 'gi').test(m.name);
      }))
    );
  }

  close(value: any) {
    this._dialogRef.close(value);
  }

  displayAutocompleteForValue($event: any) {
    return $event.name;
  }

  selectMonster($event: MatAutocompleteSelectedEvent) {
    console.log(this.monsterInputControl.value);
  }
}
