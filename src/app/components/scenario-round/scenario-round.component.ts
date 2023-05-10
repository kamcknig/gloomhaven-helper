import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CombatService } from '../../combat/services/combat.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-scenario-round',
  templateUrl: './scenario-round.component.html',
  styleUrls: ['./scenario-round.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class ScenarioRoundComponent implements OnInit, OnDestroy {
  private _destroy$: Subject<void> = new Subject<void>();

  public roundInputControl: FormControl = new FormControl<any>('');

  constructor(
    public combatService: CombatService
  ) {
  }

  ngOnInit(): void {
    this.combatService.store.round$.pipe(takeUntil(this._destroy$))
      .subscribe({
        next: round => this.roundInputControl.setValue(round.toString())
      });

    this.roundInputControl.disable();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
  }
}
