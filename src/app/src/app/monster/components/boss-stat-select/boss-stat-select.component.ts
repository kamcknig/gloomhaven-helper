import {Component, Inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {DIALOG_DATA} from "@angular/cdk/dialog";
import {Monster} from "../../../../../monster/services/model";
import {FlexLayoutModule} from '@angular/flex-layout';

@Component({
  selector: 'app-boss-stat-select',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatDialogModule, MatButtonModule],
  templateUrl: './boss-stat-select.component.html',
  styleUrls: ['./boss-stat-select.component.scss']
})
export class BossStatSelectComponent implements OnInit {
  public formGroup: FormGroup;

  public readonly attributes: string[] = ['health', 'move', 'attack', 'range'];

  constructor(
    private _form: FormBuilder,
    @Inject(DIALOG_DATA) private _data: { monster: Monster }
  ) {
  }

  ngOnInit(): void {
    this.formGroup = this._form.group({
      name: new FormControl('Boss'),
      attributes: this._form.group(this.attributes.reduce((prev, next) => {
        prev[next] = new FormControl<number>(undefined, Validators.required);
        return prev;
      }, {}))
    });
  }

  public getValue(): Monster {
    return {
      ...this._data.monster,
      ...this.formGroup.value,
      attributes: {
        ...Object.entries(this.formGroup.value.attributes).reduce((prev, [key, value]) => {
          prev[key] = new Array(7).fill([value, value]);
          return prev;
        }, {})
      }
    }
  }
}
