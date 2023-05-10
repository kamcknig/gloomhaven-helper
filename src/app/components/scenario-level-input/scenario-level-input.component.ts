import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';
import { AppService } from '../../app.service';
import { takeUntil } from 'rxjs/operators';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAX_LEVEL } from 'src/app/scenario-options/max-level.token';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scenario-level-input',
  templateUrl: './scenario-level-input.component.html',
  styleUrls: ['./scenario-level-input.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class ScenarioLevelInputComponent implements OnInit, OnDestroy {
  private _destroy$: Subject<void> = new Subject<void>();

  protected readonly Math = Math;

  public level$: BehaviorSubject<number> = new BehaviorSubject<number>(undefined);

  constructor(@Inject(MAX_LEVEL) public MAX_LEVEL: number, public appService: AppService) { }

  ngOnInit(): void {
    this.appService.scenarioStore.level$.pipe(takeUntil(this._destroy$)).subscribe(this.level$);
  }

  ngOnDestroy(): void {
    this._destroy$.next();
  }
}
