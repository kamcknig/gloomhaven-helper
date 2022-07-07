import { Component } from '@angular/core';
import { ElementService } from '../../elements/element.service';
import { MonsterService } from '../../monster/services/monster.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(
    public monsterService: MonsterService,
    public elementService: ElementService
  ) {
  }
}
