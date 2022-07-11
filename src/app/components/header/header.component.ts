import { Component } from '@angular/core';
import { ElementService } from '../../elements/element.service';
import { MonsterService } from '../../monster/services/monster.service';
import { ElementPhases } from '../../elements/model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  public ElementPhases = ElementPhases;

  constructor(
    public monsterService: MonsterService,
    public elementService: ElementService
  ) {
  }
}
