import { Component, Inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { filter, map, startWith } from 'rxjs/operators';
import { Monster } from '../services/model';

@Component({
  selector: 'app-activate-monster-dialog',
  templateUrl: './activate-monster-dialog.component.html',
  styleUrls: ['./activate-monster-dialog.component.scss']
})
export class ActivateMonsterDialogComponent implements OnInit {
  public filteredAvailableMonsters$: Observable<Monster[]> | undefined;
  public monsterInputControl: FormControl = new FormControl('');

  constructor(
    private _dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) private _data: Monster[]
  ) {
  }

  ngOnInit(): void {
    this.monsterInputControl.setValue(this._data[0]);

    this.filteredAvailableMonsters$ = this.monsterInputControl.valueChanges.pipe(
      startWith(undefined),
      map(value => value?.name ?? value),
      map(value => this._data.filter(m => new RegExp(`${value?.toLowerCase() ?? ''}`, 'gi').test(m.name)))
    );
  }

  close(value: any) {
    this._dialogRef.close(value);
  }

  displayAutocompleteForValue($event: any) {
    return $event?.name ?? '';
  }
}
