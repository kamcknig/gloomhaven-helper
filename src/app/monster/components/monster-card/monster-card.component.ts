import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-monster-card',
  templateUrl: './monster-card.component.html',
  styleUrls: ['./monster-card.component.scss']
})
export class MonsterCardComponent implements OnInit {
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
