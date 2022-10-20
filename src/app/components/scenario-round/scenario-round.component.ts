import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AppService } from '../../app.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CombatService } from '../../combat/services/combat.service';
import { MonsterService } from '../../monster/services/monster.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scenario-round',
  templateUrl: './scenario-round.component.html',
  styleUrls: ['./scenario-round.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule
  ]
})
export class ScenarioRoundComponent implements OnInit, OnDestroy {
  private _destroy$: Subject<void> = new Subject<void>();

  public roundInputControl: FormControl = new FormControl<any>('');

  constructor(
    public appService: AppService,
    public combatService: CombatService,
    public monsterService: MonsterService
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
