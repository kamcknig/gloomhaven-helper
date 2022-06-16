import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonsterCardComponent } from './components/monster-card/monster-card.component';
import { DataViewModule } from 'primeng/dataview';
import { CardModule } from 'primeng/card';



@NgModule({
  declarations: [
    MonsterCardComponent
  ],
  exports: [
    MonsterCardComponent
  ],
  imports: [
    CommonModule,
    DataViewModule,
    CardModule
  ]
})
export class MonsterModule { }
