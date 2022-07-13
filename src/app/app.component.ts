import { Component, HostListener } from '@angular/core';
import { MonsterService } from './monster/services/monster.service';
import { AppService } from './app.service';
import { CombatService } from './combat/services/combat.service';
import { Subject } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'gloomhaven-helper';
  private _roundComplete$ = new Subject();

  @HostListener('document:keyup.control.m')
  public activateMonster() {
    this.monsterService.selectMonsterToActivate().subscribe();
  }

  @HostListener('document:keyup.control.arrowup')
  public scenarioLevelUp() {
    this.appService.scenarioLevelUpdate$.next('+1');
  }

  @HostListener('document:keyup.control.arrowdown')
  public scenarioLevelDown() {
    this.appService.scenarioLevelUpdate$.next('-1');
  }

  @HostListener('document:keyup.control.arrowright')
  public roundComplete() {
    this._roundComplete$.next();
  }

  constructor(
    public monsterService: MonsterService,
    public appService: AppService,
    public combatService: CombatService
  ) {
    this._roundComplete$.pipe(
      switchMap(() => monsterService.monsterStore.activeMonsters$),
      filter(monsters => !!monsters.length)
    ).subscribe({
      next: () => combatService.roundComplete$.next()
    })
  }
}
