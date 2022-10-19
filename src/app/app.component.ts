import {Component, HostListener, OnInit} from '@angular/core';
import { MonsterService } from './monster/services/monster.service';
import { AppService } from './app.service';
import { CombatService } from './combat/services/combat.service';
import { combineLatest, Observable, Subject } from 'rxjs';
import {filter, map, switchMap, takeUntil, tap} from 'rxjs/operators';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public title = 'gloomhaven-helper';
  public viewMode = 'normal';
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
  public sortedMonsters$: Observable<number[]>;

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

    this.sortedMonsters$ = combineLatest([
      this.combatService.store.activeMonsters$,
      this.monsterService.monsterStore.activeMonsters$
    ])
      .pipe(
        map(([combatMonsters, monsters]) =>
          Object.entries(combatMonsters)
            .sort(([id1, { abilities: abilities1 }], [id2, { abilities: abilities2 }]) => {
              const m1Initiative = abilities1?.reduce(
                (initiative, nextCard) => (nextCard.drawn && nextCard.initiative) || initiative, undefined as number)
              const m2Initiative = abilities2?.reduce(
                (initiative, nextCard) => (nextCard.drawn && nextCard.initiative) || initiative, undefined as number)

              if (m1Initiative === undefined && m2Initiative === undefined) {
                const name1 = monsters.find(m => m.id === +id1)?.name;
                const name2 = monsters.find(m => m.id === +id2)?.name;
                if (name1 < name2) {
                  return -1;
                } else if (name2 > name1) {
                  return 1;
                } else {
                  return 0;
                }
              }

              if (m1Initiative === undefined) {
                return 1;
              }

              if (m2Initiative === undefined) {
                return -1;
              }

              return m1Initiative - m2Initiative;
            })
            .map(m => +m[0]))
      );
  }
}
