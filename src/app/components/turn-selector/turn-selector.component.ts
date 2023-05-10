import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { CombatService } from "../../combat/services/combat.service";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-turn-selector',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './turn-selector.component.html',
  styleUrls: ['./turn-selector.component.scss']
})
export class TurnSelectorComponent implements OnInit {

  constructor(
    public combatService: CombatService
  ) { }

  ngOnInit(): void {
  }

}
