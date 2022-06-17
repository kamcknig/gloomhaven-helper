import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-add-token-dialog',
  templateUrl: './add-token-dialog.component.html',
  styleUrls: ['./add-token-dialog.component.scss']
})
export class AddTokenDialogComponent implements OnInit {
  public value: number[];
  constructor(
    private _dialogRef: DynamicDialogRef,
    private _dialogConfig: DynamicDialogConfig
  ) {
    this.value = this._dialogConfig.data;
  }

  ngOnInit(): void {
  }

  selectTokenNumber(number: number) {
    this._dialogRef.close(number);
  }
}
