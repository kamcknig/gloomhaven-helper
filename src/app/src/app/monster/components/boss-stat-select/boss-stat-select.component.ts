import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
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
import {Subject} from "rxjs";

@Component({
  selector: 'app-boss-stat-select',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatDialogModule, MatButtonModule, MatDividerModule, MatCheckboxModule],
  templateUrl: './boss-stat-select.component.html',
  styleUrls: ['./boss-stat-select.component.scss']
})
export class BossStatSelectComponent implements OnInit, OnDestroy {
  private _destroy$: Subject<void> = new Subject<void>();

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

  public Attributes = Object.values(Attributes);
  public Conditions = Object.values(Conditions);
  public AttackEffects = Object.values(AttackEffects);
  public Bonuses = Object.values(Bonuses);

  constructor(
    private _form: FormBuilder,
    @Inject(DIALOG_DATA) private _data: Monster
  ) {
  }

  ngOnInit(): void {
    this.formGroup = this._form.group({
      name: new FormControl('Boss'),
      attributes: this._form.array(
        this.Attributes.map(next => new FormControl<number>(undefined, [Validators.required, Validators.min(1)]))),
      conditions: this._form.array(this.Conditions.map(next => new FormControl<boolean>(undefined))),
      attackEffects: this._form.array(this.AttackEffects.map(next => this._form.group({
        has: new FormControl<boolean>(undefined),
        value: new FormControl<number>({ value: 1, disabled: true }, [Validators.required, Validators.min(1)])
      }))),
      bonuses: this._form.array(this.Bonuses.map(next => this._form.group({
        has: new FormControl<boolean>(undefined),
        value: new FormControl<number>({ value: 1, disabled: true }, [Validators.min(1), Validators.required]),
        'value-2': new FormControl<number>({ value: 1, disabled: true }, [Validators.min(0), Validators.required])
      })))
    });

    this.formGroup.controls.bonuses.controls.concat(this.formGroup.controls.attackEffects.controls as any).forEach(c => {
      c.get('has').valueChanges.subscribe({
        next: value => {
          c.get('value')[value ? 'enable' : 'disable']();
          c.get('value-2')?.[value ? 'enable' : 'disable']();
        }
      });
    });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public getValue(): Monster {
    return {
      ...this._data,
      ...this.formGroup.value,
      attributes: {
        ...Object.values(Attributes).reduce((prev, next, idx) => {
          prev[next] = new Array(7).fill([this.formGroup.value.attributes[idx], this.formGroup.value.attributes[idx]]);
          return prev;
        }, {} as any)
      },
      conditions: {
        ...Object.values(Conditions).reduce((prev, next, idx) => {
          prev[next] = new Array(7).fill(
            [!!this.formGroup.value.conditions[idx] ? 1 : 0, !!this.formGroup.value.conditions[idx] ? 1 : 0]);
          return prev;
        }, {} as any)
      },
      attackEffects: {
        ...Object.values(AttackEffects).reduce((prev, next, idx) => {
          prev[next] = new Array(7).fill([
            !!this.formGroup.value.attackEffects[idx].has ? this.formGroup.value.attackEffects[idx].value : 0, !!this.formGroup.value.attackEffects[idx].has ? this.formGroup.value.attackEffects[idx].value : 0
          ])
          return prev;
        }, {} as any)
      },
      bonuses: {
        ...Object.values(Bonuses).reduce((prev, next, idx) => {
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
