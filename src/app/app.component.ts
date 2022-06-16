import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'gloomhaven-helper';

  dockModel: MenuItem[] = [
    {
      label: 'Test',
      tooltipOptions: {
        tooltipLabel: 'Add monster',
        tooltipPosition: 'top',
        showDelay: 300,
        positionLeft: 20
      }
    },
    {
      label: 'Add monster',
      icon: 'assets/monster-ability-cards/monster-ability-card-back.jpg',
      tooltipOptions: {
        tooltipLabel: 'Add monster',
        tooltipPosition: 'top',
        showDelay: 300,
        positionLeft: 20
      }
    }
  ];

  constructor(public appService: AppService) {
  }
}
