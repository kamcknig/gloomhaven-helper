import {AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {DIALOG_DATA} from "@angular/cdk/dialog";
import {AttackEffects, Attributes, Bonuses, Conditions, Monster} from "../../services/model";
import {MatDividerModule} from '@angular/material/divider';
import {Subject} from "rxjs";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";

type BossForm = {
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
};

@Component({
  selector: 'app-create-boss',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatDialogModule, MatButtonModule, MatDividerModule, MatCheckboxModule],
  templateUrl: './create-boss.component.html',
  styleUrls: ['./create-boss.component.scss']
})
export class CreateBossComponent implements OnInit, OnDestroy, AfterViewInit {
  private _destroy$: Subject<void> = new Subject<void>();

  @ViewChildren('bonusValueInput', { read: MatInput }) public bonusValueInputs: QueryList<MatInput>;
  @ViewChildren('bonusValueInput', { read: ElementRef }) public bonusValueInputEls: QueryList<ElementRef<HTMLInputElement>>;

  @ViewChildren('attackEffectValueInput', { read: MatInput }) public attackEffectValueInputs: QueryList<MatInput>;
  @ViewChildren('attackEffectValueInput', { read: ElementRef }) public attackEffectValueInputEls: QueryList<ElementRef<HTMLInputElement>>;

  ngAfterViewInit() {
    const func = (inputs: QueryList<MatInput>, els: QueryList<ElementRef<HTMLInputElement>>) => (c: FormGroup, idx: number) => {
      c.get('has').valueChanges.subscribe({
        next: value => {
          c.get('value')[value ? 'enable' : 'disable']();
          c.get('value-2')?.[value ? 'enable' : 'disable']();

          if (value) {
            inputs.get(idx)?.focus();
            els.get(idx)?.nativeElement.select();
          }
        }
      });
    }
    this.formGroup.controls.attackEffects.controls.forEach(func(this.attackEffectValueInputs, this.attackEffectValueInputEls))
    this.formGroup.controls.bonuses.controls.forEach(func(this.bonusValueInputs, this.bonusValueInputEls));
  }

  public formGroup: FormGroup<BossForm>;

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
        this.Attributes.map(attr => new FormControl<number>(undefined, [Validators.required, Validators.min(attr === Attributes.health ? 1 : 0)]))),
      conditions: this._form.array(this.Conditions.map(() => new FormControl<boolean>(undefined))),
      attackEffects: this._form.array(this.AttackEffects.map(() => this._form.group({
        has: new FormControl<boolean>(undefined),
        value: new FormControl<number>({value: 1, disabled: true}, [Validators.required, Validators.min(1)])
      }))),
      bonuses: this._form.array(this.Bonuses.map(() => this._form.group({
        has: new FormControl<boolean>(undefined),
        value: new FormControl<number>({value: 1, disabled: true}, [Validators.min(1), Validators.required]),
        'value-2': new FormControl<number>({value: 1, disabled: true}, [Validators.min(0), Validators.required])
      })))
    });

    // uncomment to have a  boss pre-filled with some data
    /*this.formGroup.setValue({
      attackEffects: [{has: true, value: 1}, { has: true, value: 1}, { has: false, value: 1}, { has: false, value: 1}],
      attributes: [1, 1, 1, 1],
      name: 'Boss',
      conditions: [true, true, true, true, false, false, false, false, false, false],
      bonuses: [{has: true, value: 1, "value-2": 1}, { has: true, value: 1, "value-2": 1}]
    });*/
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
              !!this.formGroup.value.bonuses[idx].has ? this.formGroup.value.bonuses[idx].value : 0,
              !!this.formGroup.value.bonuses[idx].has ? this.formGroup.value.bonuses[idx].value : 0
            ]
          );
          return prev;
        }, {} as any)
      }
    }
  }
}
