import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatLegacyButtonModule as MatButtonModule} from "@angular/material/legacy-button";
import {MatIconModule} from "@angular/material/icon";
import {FlexModule} from "@angular/flex-layout";
import {ApplicableConditions} from '../../../monster/services/model';
import {CombatService} from "../../../combat/services/combat.service";
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogModule as MatDialogModule, MatLegacyDialogRef as MatDialogRef} from "@angular/material/legacy-dialog";
import {TokenInfo} from "../../../combat/services/model";
import {filter, map, takeUntil, tap} from "rxjs/operators";
import {Observable, Subject} from "rxjs";
import {MatLegacyFormFieldModule as MatFormFieldModule} from "@angular/material/legacy-form-field";
import {MatLegacyInputModule as MatInputModule} from "@angular/material/legacy-input";
import {FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {LetModule} from "@ngrx/component";

@Component({
  selector: 'app-token-detail-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, FlexModule, MatDialogModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, LetModule],
  templateUrl: './token-detail-dialog.component.html',
  styleUrls: ['./token-detail-dialog.component.scss']
})
export class TokenDetailDialogComponent implements OnInit, OnDestroy {
  private _destroy$: Subject<void> = new Subject<void>();

  public ApplicableConditions = ApplicableConditions;
  public token$: Observable<TokenInfo>;

  public hitPointControl: FormControl<number>;

  constructor(
    public combatService: CombatService,
    public dialog: MatDialogRef<TokenDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TokenInfo
  ) {
  }

  ngOnInit(): void {
    this.token$ = this.combatService.store.tokens$.pipe(
      map(tokens => tokens.find(t => t.number === this.data.number && t.monsterId === this.data.monsterId)),
      tap(t => {
        if (!t) {
          this.dialog.close();
        }
      }),
      takeUntil(this._destroy$)
    )

    this.token$.pipe(filter(t => !!t),takeUntil(this._destroy$)).subscribe({
      next: token => {
        this.hitPointControl = new FormControl<number>(token.health ?? token.maxHealth, Validators.min(0))
      }
    })
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
