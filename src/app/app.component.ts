import {Component, HostListener, OnInit} from '@angular/core';
import {MonsterService} from './monster/services/monster.service';
import {AppService} from './app.service';
import {CombatService} from './combat/services/combat.service';
import {combineLatest, Observable, Subject} from 'rxjs';
import {filter, map, switchMap, withLatestFrom} from 'rxjs/operators';
import {ActivatedRoute} from "@angular/router";
import {Monster} from './monster/services/model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public title = 'gloomhaven-helper';

  private _roundComplete$ = new Subject();

  @HostListener('document:keyup.control.m')
  public activateMonster() {
    this.monsterService.selectMonsterToActivate()
      .subscribe();
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

  /**
   * Emits an array of numbers whose elements are the IDs of the active monsters in combat ordered by the
   * initiative of their currently drawn ability card
   */
  public sortedMonsters$: Observable<Monster[]>;

  constructor(
    public monsterService: MonsterService,
    public appService: AppService,
    public combatService: CombatService,
    private _route: ActivatedRoute
  ) {
  }

  public ngOnInit(): void {
    combineLatest([
      this._route.queryParams.pipe(map(r => r['v']), filter(r => !!r)),
      this.appService.scenarioStore.viewMode$
    ]).subscribe({
      next: ([paramViewMode, currentViewMode]) => paramViewMode && currentViewMode !== paramViewMode ? this.appService.toggleViewMode$.next() : null
    });

    this._roundComplete$.pipe(
        switchMap(() => this.combatService.store.activeMonsters$),
        filter(monsters => !!Object.keys(monsters)?.length)
      )
      .subscribe({
        next: () => this.combatService.roundComplete$.next()
      });

    this.sortedMonsters$ = this.combatService.store.sortedMonsters$.pipe(
      withLatestFrom(this.monsterService.monsterStore.activeMonsters$),
      map(([sortedMonsters, monsters]) => Object.keys(sortedMonsters)
        .map(id => monsters.find(m => m.id.toString() === id.toString()))
      )
    );
  }
}
