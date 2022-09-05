import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {AppService} from "../../../app.service";

@Component({
  selector: 'app-select-monster-level-override',
  templateUrl: './select-monster-level-override.component.html',
  styleUrls: ['./select-monster-level-override.component.scss']
})
export class SelectMonsterLevelOverrideComponent implements OnInit {
  public formGroup: FormGroup;

  public monsterLevel$: Observable<number>;

  constructor(
    private _formBuilder: FormBuilder,
    private _appService: AppService,
    public matDialog: MatDialogRef<SelectMonsterLevelOverrideComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any
  ) {
  }

  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({
      level: new FormControl(this._data.level)
    });

    this.monsterLevel$ = this._appService.monsterLevel(this._data.monsterId);

    this.monsterLevel$.pipe(take(1)).subscribe({
      next: value => {
        this.formGroup.get('level').setValue(value);
      }
    });
  }
}

import {Observable} from "rxjs";
import {take} from "rxjs/operators";