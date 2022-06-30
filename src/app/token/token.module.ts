import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TokenListItemComponent } from './components/token-list-item/token-list-item.component';
import { FlexModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [
    TokenListItemComponent
  ],
  exports: [
    TokenListItemComponent
  ],
  imports: [
    CommonModule,
    FlexModule,
    MatIconModule
  ]
})
export class TokenModule { }
