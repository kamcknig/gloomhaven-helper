import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TokenInfo, TokenService } from '../../services/token.service';

@Component({
  selector: 'app-token-list-item',
  templateUrl: './token-list-item.component.html',
  styleUrls: ['./token-list-item.component.scss']
})
export class TokenListItemComponent implements OnInit {
  @Input() public value: TokenInfo | undefined;
  @Input() public statuses: { name: string, value: number }[] | undefined;

  @Output() public statusPress: EventEmitter<void> = new EventEmitter<void>();

  constructor(public tokenService: TokenService) { }

  ngOnInit(): void {
  }

}
