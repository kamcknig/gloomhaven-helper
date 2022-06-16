import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-attack-card',
  templateUrl: './attack-card.component.html',
  styleUrls: ['./attack-card.component.scss']
})
export class AttackCardComponent implements OnInit {
  monsters: any[] = [
    {
      name: 'Monster 1'
    },
    {
      name: 'Monster 2'
    }
  ]
  constructor() { }

  ngOnInit(): void {
  }

}
