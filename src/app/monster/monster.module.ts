import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActiveMonsterCard } from './components/active-monster-card/active-monster-card.component';
import { DataViewModule } from 'primeng/dataview';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { AddTokenDialogComponent } from './components/active-monster-card/add-token-dialog/add-token-dialog.component';
import { RippleModule } from 'primeng/ripple';
import { FlexLayoutModule } from '@angular/flex-layout';



@NgModule({
  declarations: [
    ActiveMonsterCard,
    AddTokenDialogComponent
  ],
  exports: [
    ActiveMonsterCard
  ],
  imports: [
    CommonModule,
    DataViewModule,
    CardModule,
    DividerModule,
    ButtonModule,
    ScrollPanelModule,
    RippleModule,
    FlexLayoutModule
  ]
})
export class MonsterModule { }
