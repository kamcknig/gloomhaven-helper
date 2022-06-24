import { Component, Inject, OnInit } from '@angular/core';
import { TokenInfo } from '../../../../token/services/token.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-token-dialog',
  templateUrl: './add-token-dialog.component.html',
  styleUrls: ['./add-token-dialog.component.scss']
})
export class AddTokenDialogComponent implements OnInit {
  public value: { normals: TokenInfo[], elites: TokenInfo[] };
  public defaultNumbers: number[];

  constructor(
    private _dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) private _data: any
  ) {
    this.defaultNumbers = Array(10)
      .fill(0)
      .map((x, i) => i + 1);
    this.value = this._data;
  }

  ngOnInit(): void {
  }

  /**
   * Checks if the token number is already taken and returns 'hidden' if it does, otherwise 'visible'
   * @param index
   */
  getTokenButtonVisible(index: number) {
    return this.value?.elites?.concat(this.value?.normals ?? [])
      ?.find(e => e.number === index)
      ? 'hidden'
      : 'visible'
      ?? 'visible';
  }

  /**
   * Event handler when user selects a token. Closes the dialog and passes a Tuple with the number selected
   * and whether it was an elite or not
   *
   * @param number
   * @param elite
   */
  selectTokenNumber(number: number, elite: boolean = false) {
    this._dialogRef.close([number, elite]);
  }
}
