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
import { ActivateMonsterDialogComponent } from './activate-monster-dialog/activate-monster-dialog.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { MatCardModule } from '@angular/material/card';



@NgModule({
  declarations: [
    ActiveMonsterCard,
    AddTokenDialogComponent,
    ActivateMonsterDialogComponent
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
    FlexLayoutModule,
    AutoCompleteModule,
    FormsModule,
    DialogModule,
    MatCardModule
  ]
})
export class MonsterModule { }
