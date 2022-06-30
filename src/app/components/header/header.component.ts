import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { FormControl } from '@angular/forms';
import { map, Subject, take, takeUntil, tap, withLatestFrom } from 'rxjs';
import { ElementInfo, ElementService } from '../../elements/element.service';
import {
  ActivateMonsterDialogComponent
} from '../../monster/activate-monster-dialog/activate-monster-dialog.component';
import { MonsterInfo, MonsterService } from '../../monster/services/monster.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  private _destroy$: Subject<void> = new Subject<void>();

  levelInputControl = new FormControl('');

  constructor(
    public monsterService: MonsterService,
    public appService: AppService,
    public elementService: ElementService,
    private _dialogService: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.appService.scenarioStore.level$.pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (value) => {
          this.levelInputControl.setValue(value.toString());
        }
      })
  }

  updateElement(element: string) {
    this.elementService.elementStore.infusedElements$.pipe(
      withLatestFrom(
        this.elementService.elementStore.waningElements$,
        this.elementService.elementStore.inertElements$
      ),
      take(1),
      tap(([infused, waning, inert]) => {
        if (infused.includes(element as ElementInfo)) {
          this.elementService.waneElement$.next(element as ElementInfo);
        } else if (waning.includes(element as ElementInfo)) {
          this.elementService.inertElement$.next(element as ElementInfo);
        } else {
          this.elementService.infuseElement$.next(element as ElementInfo);
        }
      }),
    )
      .subscribe();
  }

  isInfused(element: string) {
    return this.elementService.elementStore.infusedElements$.pipe(
      map(elements => elements.find(e => e === element))
    );
  }

  isWaning(element: string) {
    return this.elementService.elementStore.waningElements$.pipe(
      map(elements => elements.find(e => e === element))
    );
  }
}
