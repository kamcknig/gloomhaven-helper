import { Component, HostListener, OnInit } from '@angular/core';
import { AppService } from './app.service';
import { MonsterInfo, MonsterService } from './monster/services/monster.service';
import { map, Observable, Subject, take, takeUntil, tap, withLatestFrom } from 'rxjs';
import { ActivateMonsterDialogComponent } from './monster/activate-monster-dialog/activate-monster-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { ElementInfo, Elements, ElementService } from './elements/element.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private _destroy$: Subject<void> = new Subject<void>();

  title = 'gloomhaven-helper';
  levelInputControl = new FormControl('');

  @HostListener('document:keyup', ['$event'])
  public onKeyUp(event: KeyboardEvent) {
    if (!event.ctrlKey) {
      return;
    }

    if (event.code === 'ArrowUp' || event.key === 'ArrowUp') {
      this.appService.scenarioLevel$.next('+1');
    } else if (event.code === 'ArrowDown' || event.key === 'ArrowDown'){
      this.appService.scenarioLevel$.next('-1');
    }
  }

  public activateMonster(...args: any[]): void {
    this._dialogService.open(ActivateMonsterDialogComponent, {
      disableClose: false,
      autoFocus: false
    })
      .afterClosed()
      .subscribe({
        next: id => {
          let monster: MonsterInfo | undefined;
          this.monsterService.monsterStore.monsters$
            .pipe(
              map(monsters => monsters.find(m => m.id === id)),
              take(1)
            )
            .subscribe({
              next: (value) => monster = value
            });

          if (!monster) {
            return;
          }
          this.monsterService.activateMonster$.next(monster);
        }
      });
  }

  constructor(
    public appService: AppService,
    public monsterService: MonsterService,
    private _dialogService: MatDialog,
    public elementService: ElementService
  ) {

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
    ).subscribe();
  }
}
