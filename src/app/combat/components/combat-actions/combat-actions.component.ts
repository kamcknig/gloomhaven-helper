import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-combat-actions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './combat-actions.component.html',
  styleUrls: ['./combat-actions.component.scss']
})
export class CombatActionsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
