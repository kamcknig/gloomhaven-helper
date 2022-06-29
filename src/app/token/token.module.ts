import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TokenListItemComponent } from './components/token-list-item/token-list-item.component';
import { FlexModule } from '@angular/flex-layout';



@NgModule({
  declarations: [
    TokenListItemComponent
  ],
  exports: [
    TokenListItemComponent
  ],
  imports: [
    CommonModule,
    FlexModule
  ]
})
export class TokenModule { }
