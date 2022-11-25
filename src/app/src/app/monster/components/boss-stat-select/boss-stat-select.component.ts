import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { DIALOG_DATA } from "@angular/cdk/dialog";
import { AttackEffects, Attributes, Bonuses, Conditions, Monster } from "../../../../../monster/services/model";
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
    attackEffects: FormArray<FormGroup<{
      has: FormControl<boolean>,
      value: FormControl<number>
    }>>;
    bonuses: FormArray<FormGroup<{
      has: FormControl<boolean>;
      value: FormControl<number>;
      'value-2': FormControl<number>;
    }>>;
  }>;

  public Attributes = Attributes;
  public Conditions = Conditions;
  public AttackEffects = AttackEffects;
  public Bonuses = Bonuses;

  constructor(
    private _form: FormBuilder,
    @Inject(DIALOG_DATA) private _data: { monster: Monster }
  ) {
  }

  ngOnInit(): void {
    this.formGroup = this._form.group({
      name: new FormControl('Boss'),
      attributes: this._form.array(
        this.Attributes.map(next => new FormControl<number>(undefined, [Validators.required, Validators.min(1)]))),
      conditions: this._form.array(this.Conditions.map(next => new FormControl<boolean>(undefined))),
      attackEffects: this._form.array(this.Conditions.map(next => this._form.group({
        has: new FormControl<boolean>(undefined),
        value: new FormControl<number>(undefined)
      }))),
      bonuses: this._form.array(this.Bonuses.map(next => this._form.group({
        has: new FormControl<boolean>(undefined),
        value: new FormControl<number>(1, [Validators.min(1), Validators.required]),
        'value-2': new FormControl<number>(1, [Validators.min(0), Validators.required])
      })))
    });

    this.formGroup.valid
  }

  public getValue(): Monster {
    return {
      ...this._data.monster,
      ...this.formGroup.value,
      attributes: {
        ...Attributes.reduce((prev, next, idx) => {
          prev[next] = new Array(7).fill([this.formGroup.value.attributes[idx], this.formGroup.value.attributes[idx]]);
          return prev;
        }, {} as any)
      },
      conditions: {
        ...Conditions.reduce((prev, next, idx) => {
          prev[next] = new Array(7).fill(
            [!!this.formGroup.value.conditions[idx] ? 1 : 0, !!this.formGroup.value.conditions[idx] ? 1 : 0]);
          return prev;
        }, {} as any)
      },
      attackEffects: {
        ...AttackEffects.reduce((prev, next, idx) => {
          prev[next] = new Array(7).fill([
            !!this.formGroup.value.attackEffects[idx].has ? this.formGroup.value.attackEffects[idx].value : 0, !!this.formGroup.value.attackEffects[idx].has ? this.formGroup.value.attackEffects[idx].value : 0
          ])
          return prev;
        }, {} as any)
      },
      bonuses: {
        ...Bonuses.reduce((prev, next, idx) => {
          prev[next] = new Array(7).fill(next === 'retaliate'
            ? [
              [!!this.formGroup.value.bonuses[idx].has ? this.formGroup.value.bonuses[idx].value : 0, this.formGroup.value.bonuses[idx]['value-2']],
              [!!this.formGroup.value.bonuses[idx].has ? this.formGroup.value.bonuses[idx].value : 0, this.formGroup.value.bonuses[idx]['value-2']]
            ]
            : [
              [
                !!this.formGroup.value.bonuses[idx].has ? this.formGroup.value.bonuses[idx].value : 0,
                !!this.formGroup.value.bonuses[idx].has ? this.formGroup.value.bonuses[idx].value : 0
              ]
            ]
          );
          return prev;
        }, {} as any)
      }
    }
  }
}
