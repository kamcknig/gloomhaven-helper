import {Component} from '@angular/core';
import {ElementService} from '../../elements/element.service';
import {ElementPhases} from '../../elements/model';
import {FlexLayoutModule} from '@angular/flex-layout';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {ScenarioLevelInputComponent} from '../scenario-level-input/scenario-level-input.component';
import {ScenarioRoundComponent} from '../scenario-round/scenario-round.component';
import {TurnSelectorComponent} from "../turn-selector/turn-selector.component";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatToolbarModule,
    ScenarioLevelInputComponent,
    ScenarioRoundComponent,
    TurnSelectorComponent
  ]
})
export class HeaderComponent {
  public ElementPhases = ElementPhases;

  constructor(
    public elementService: ElementService
  ) {
  }
}
