import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { AppService } from '../../app.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-scenario-level-input',
  templateUrl: './scenario-level-input.component.html',
  styleUrls: ['./scenario-level-input.component.scss']
})
export class ScenarioLevelInputComponent implements OnInit, OnDestroy {
  private _destroy$: Subject<void> = new Subject<void>();

  public levelInputControl = new FormControl('');

  constructor(public appService: AppService) { }

  ngOnInit(): void {
    this.appService.scenarioStore.level$.pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (value) => {
          this.levelInputControl.setValue(value.toString());
        }
      })
  }

  ngOnDestroy(): void {
    this._destroy$.next();
  }
}
