import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { filter, map, startWith } from 'rxjs/operators';
import { Monster } from '../../services/model';
import { MatAutocompleteModule, MatAutocompleteTrigger } from "@angular/material/autocomplete";
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-activate-monster-dialog',
  templateUrl: './activate-monster-dialog.component.html',
  styleUrls: ['./activate-monster-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule
  ]
})
export class ActivateMonsterDialogComponent implements OnInit, AfterViewInit {
  @ViewChild('monsterAutoComplete') public monsterAutoComplete: ElementRef;
  @ViewChild(MatAutocompleteTrigger) monsterAutoCompleteTrigger: MatAutocompleteTrigger;


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

  ngAfterViewInit(): void {
    this.monsterAutoComplete.nativeElement.focus();
    this.monsterAutoCompleteTrigger.closePanel();
    setTimeout(() => {
      this.monsterAutoComplete.nativeElement.select();
    }, 0);
  }

  close(value: any) {
    this._dialogRef.close(value);
  }

  displayAutocompleteForValue($event: any) {
    return $event?.name ?? '';
  }
}
