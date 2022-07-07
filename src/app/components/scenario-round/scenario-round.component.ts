import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AppService } from '../../app.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-scenario-round',
  templateUrl: './scenario-round.component.html',
  styleUrls: ['./scenario-round.component.scss']
})
export class ScenarioRoundComponent implements OnInit, OnDestroy {
  private _destroy$: Subject<void> = new Subject<void>();

  public roundInputControl: FormControl = new FormControl<any>('');

  constructor(public appService: AppService) { }

  ngOnInit(): void {
    this.appService.scenarioStore.round$.pipe(takeUntil(this._destroy$)).subscribe({
      next: round => this.roundInputControl.setValue(round.toString())
    });

    this.roundInputControl.disable();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
  }
}
