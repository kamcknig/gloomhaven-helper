import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { FlexModule } from "@angular/flex-layout";
import { ApplicableConditions } from '../../services/model';
import { CombatService } from "../../../combat/services/combat.service";
import { MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";
import { TokenInfo } from "../../../combat/services/model";
import { map, takeUntil } from "rxjs/operators";
import { Observable, Subject } from "rxjs";

@Component({
  selector: 'app-toggle-status-effect-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, FlexModule, MatDialogModule],
  templateUrl: './toggle-status-effect-dialog.component.html',
  styleUrls: ['./toggle-status-effect-dialog.component.scss']
})
export class ToggleStatusEffectDialogComponent implements OnInit, OnDestroy {
  private _destroy$: Subject<void> = new Subject<void>();

  public ApplicableConditions = ApplicableConditions;
  public token$: Observable<TokenInfo>;

  constructor(
    public combatService: CombatService,
    @Inject(MAT_DIALOG_DATA) public data: TokenInfo
  ) { }

  ngOnInit(): void {
    this.token$ = this.combatService.store.tokens$.pipe(
      map(tokens => tokens.find(t => t.number === this.data.number && t.monsterId === this.data.monsterId)),
      takeUntil(this._destroy$)
    )
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
