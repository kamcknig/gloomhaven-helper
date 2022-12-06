import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {filter, map, startWith} from 'rxjs/operators';
import {Monster} from '../../services/model';
import {MatAutocompleteModule, MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {CommonModule} from '@angular/common';
import {CreateBossComponent} from "../create-boss/create-boss.component";
import {MonsterService} from "../../services/monster.service";
import {v4 as uuid} from 'uuid';

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

  private _boss: Monster;
  private _data: Monster[];

  constructor(
    private _monsterService: MonsterService,
    private _dialogRef: MatDialogRef<any>,
    private _dialogService: MatDialog,
    @Inject(MAT_DIALOG_DATA) data: Monster[]
  ) {
    // an assignment destructuring statement that separates the boss from the rest of the monsters
    ({
      boss: this._boss,
      monsters: this._data
    } = data.reduce((prev, next) => {
      if (next.name.toLowerCase() === 'boss') {
        prev['boss'] = next;
      } else {
        (prev['monsters'] = prev['monsters'] ?? []).push(next);
      }
      return prev;
    }, {} as { boss: Monster, monsters: Monster[] }));
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

  /**
   * Closes the {@link ActivateMonsterDialogComponent} and opens the
   * {@link CreateBossComponent} for stat selection. Upon boss stat
   * selection, dispatches {@link MonsterService.activateMonster$}
   */
  handleCreateBossClick() {
    this._dialogRef.close();

    this._dialogService.open(CreateBossComponent, {
      maxWidth: '500px',
      data: this._boss
    }).afterClosed().pipe(filter(result => !!result)).subscribe({
      next: monster => this._monsterService.activateMonster$.next({...monster, id: uuid(), boss: true })
    });
  }
}
