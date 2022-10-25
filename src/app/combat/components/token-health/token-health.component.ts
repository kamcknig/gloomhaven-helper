import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TokenInfo } from '../../services/model';

@Component({
  selector: 'app-token-health',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './token-health.component.html',
  styleUrls: ['./token-health.component.scss']
})
export class TokenHealthComponent implements OnInit {
  @Input() token: TokenInfo;

  constructor() { }


  ngOnInit(): void {
  }

}
