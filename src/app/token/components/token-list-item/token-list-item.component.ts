import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TokenService } from '../../services/token.service';
import { TokenInfo } from '../../services/model';

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
