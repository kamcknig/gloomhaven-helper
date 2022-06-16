import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActiveMonsterCard } from './components/active-monster-card/active-monster-card.component';
import { DataViewModule } from 'primeng/dataview';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';



@NgModule({
  declarations: [
    ActiveMonsterCard
  ],
  exports: [
    ActiveMonsterCard
  ],
  imports: [
    CommonModule,
    DataViewModule,
    CardModule,
    DividerModule
  ]
})
export class MonsterModule { }
