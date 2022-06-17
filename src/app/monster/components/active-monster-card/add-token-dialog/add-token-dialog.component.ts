import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TokenInfo } from '../../../../token/services/token.service';

@Component({
  selector: 'app-add-token-dialog',
  templateUrl: './add-token-dialog.component.html',
  styleUrls: ['./add-token-dialog.component.scss']
})
export class AddTokenDialogComponent implements OnInit {
  public value: { normals: TokenInfo[], elites: TokenInfo[] };
  public defaultNumbers: number[];
  constructor(
    private _dialogRef: DynamicDialogRef,
    private _dialogConfig: DynamicDialogConfig
  ) {
    this.defaultNumbers = Array(10).fill(0).map((x, i) => i + 1);
    this.value = this._dialogConfig.data;
  }

  ngOnInit(): void {
  }

  getTokenButtonVisible(index: number, elite: boolean) {
    return this.value[elite ? 'elites' : 'normals'].find(e => e.number === index) ? 'hidden' : 'visible';
  }

  selectTokenNumber(number: number, elite: boolean = false) {
    this._dialogRef.close([number, elite]);
  }
}
