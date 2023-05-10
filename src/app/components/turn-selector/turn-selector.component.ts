import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import { MatIconModule } from "@angular/material/icon";
import { FlexModule } from "@angular/flex-layout";
import { CombatService } from "../../combat/services/combat.service";

@Component({
  selector: 'app-turn-selector',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, FlexModule],
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
