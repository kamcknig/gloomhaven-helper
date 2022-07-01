import { Component } from '@angular/core';
import { map, take, tap, withLatestFrom } from 'rxjs';
import { ElementInfo, ElementService } from '../../elements/element.service';
import { MonsterService } from '../../monster/services/monster.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(
    public monsterService: MonsterService,
    public elementService: ElementService,
    private _dialogService: MatDialog
  ) {
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
