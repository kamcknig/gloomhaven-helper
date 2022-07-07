import { Component, HostListener } from '@angular/core';
import { MonsterService } from './monster/services/monster.service';
import { FormControl } from '@angular/forms';
import { AppService } from './app.service';
import { CombatService } from './combat/services/combat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'gloomhaven-helper';
  public levelInputControl = new FormControl('');

  @HostListener('document:keyup', ['$event'])
  public onKeyUp(event: KeyboardEvent) {
    if (!event.ctrlKey) {
      return;
    }

    if (event.code === 'ArrowUp' || event.key === 'ArrowUp') {
      this.appService.scenarioLevelUpdate$.next('+1');
    } else if (event.code === 'ArrowDown' || event.key === 'ArrowDown'){
      this.appService.scenarioLevelUpdate$.next('-1');
    } else if (event.code === 'KeyM' || event.key === 'm') {
      this.monsterService.selectMonsterToActivate().subscribe();
    }
  }

  constructor(
    public monsterService: MonsterService,
    public appService: AppService,
    public combatService: CombatService
  ) {

    this.combatService.store.state$.subscribe()
  }
}
