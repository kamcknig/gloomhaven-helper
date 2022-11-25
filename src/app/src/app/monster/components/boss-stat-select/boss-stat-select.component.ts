import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { DIALOG_DATA } from "@angular/cdk/dialog";
import { AttackEffects, Attributes, Conditions, Monster } from "../../../../../monster/services/model";
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-boss-stat-select',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatDialogModule, MatButtonModule, MatDividerModule, MatCheckboxModule],
  templateUrl: './boss-stat-select.component.html',
  styleUrls: ['./boss-stat-select.component.scss']
})
export class BossStatSelectComponent implements OnInit {
  public formGroup: FormGroup<{
    name: FormControl<string>;
    attributes: FormArray<FormControl<number>>;
    conditions: FormArray<FormControl<boolean>>;
    attackEffects: FormArray<FormControl>;
  }>;

  public Attributes = Attributes;
  public Conditions = Conditions;
  public AttackEffects = AttackEffects;

  constructor(
    private _form: FormBuilder,
    @Inject(DIALOG_DATA) private _data: { monster: Monster }
  ) {
  }

  ngOnInit(): void {
    this.formGroup = this._form.group({
      name: new FormControl('Boss'),
      attributes: this._form.array(
        this.Attributes.map(next => new FormControl<number>(undefined, Validators.required))),
      conditions: this._form.array(this.Conditions.map(next => new FormControl<boolean>(false))),
      attackEffects: this._form.array(this.Conditions.map(next => new FormControl<boolean>(false)))
    });
  }

  public getValue(): Monster {
    return {
      ...this._data.monster,
      ...this.formGroup.value,
      attributes: {
        ...Attributes.reduce((prev, next, idx) => {
          /*...this.formGroup.value.attributes.map(v => new Array(7).fill([v, v]))*/
          prev[next] = new Array(7).fill([this.formGroup.value.attributes[idx], this.formGroup.value.attributes[idx]]);
          return prev;
        }, {} as any)
      },
      conditions: {
        ...Conditions.reduce((prev, next, idx) => {
          prev[next] = new Array(7).fill([this.formGroup.value.attributes[idx], this.formGroup.value.attributes[idx]]);
          return prev;
        }, {} as any)
      },
      attackEffects: {
        ...AttackEffects.reduce((prev, next, idx) => {
          return prev;
        }, {} as any)
      }
    }
  }
}
