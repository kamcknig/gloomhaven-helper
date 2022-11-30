import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TokenInfo } from '../../../combat/services/model';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-token-dialog',
  templateUrl: './add-token-dialog.component.html',
  styleUrls: ['./add-token-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatDialogModule,
    MatButtonModule
  ]
})
export class AddTokenDialogComponent {
  public value: { normal: TokenInfo[], elite: TokenInfo[] };
  public defaultNumbers: number[];
  public selectedTokens: { normal: number[], elite: number[] } = {normal: [], elite: []};

  constructor(
    private _dialogRef: MatDialogRef<any>,
    private _cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) private _data: TokenInfo[]
  ) {
    this.defaultNumbers = Array(10)
      .fill(0)
      .map((x, i) => i + 1);
    this.value = this._data.reduce((prev, next) => {
      prev[next.elite ? 'elite' : 'normal'].push(next);
      return prev;
    }, {elite: [] as TokenInfo[], normal: [] as TokenInfo[]});
  }

  /**
   * Checks if the token number is already taken and returns 'hidden' if it does, otherwise 'visible'
   *
   * @param index
   * @param elite
   */
  getTokenButtonVisible(index: number, elite: false) {
    return this.value?.elite?.concat(this.value?.normal ?? [])
      ?.find(e => e.number === index) || (!this.isSelectable(index) && !this.isSelected(index, elite))
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
  toggleTokenNumber(number: number, elite: boolean = false) {
    let src = this.selectedTokens[elite ? 'elite' : 'normal'];
    let idx = src.findIndex(e => e === number);
    if (idx > -1) {
      src.splice(idx, 1);
    } else {
      src.push(number);
    }

    this._cdr.detectChanges();
  }

  /**
   * Returns true if the token has been selected and queued to be added.
   *
   * @param idx
   * @param elite
   */
  isSelected(idx: number, elite: boolean) {
    return this.selectedTokens[elite ? 'elite' : 'normal'].find(e => e === idx);
  }

  /**
   * Returns true if the token number is selectable.
   *
   * @param idx
   */
  isSelectable(idx: number) {
    return !this.selectedTokens.elite.concat(this.selectedTokens.normal).find(e => e === idx);
  }

  confirmTokens() {
    this._dialogRef.close(this.selectedTokens);
  }
}
