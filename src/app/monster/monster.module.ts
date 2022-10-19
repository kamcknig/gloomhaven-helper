import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonsterDetailComponent } from './components/active-monster-card/monster-detail.component';
import { AddTokenDialogComponent } from './components/active-monster-card/add-token-dialog/add-token-dialog.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ActivateMonsterDialogComponent } from './activate-monster-dialog/activate-monster-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TokenModule } from '../token/token.module';
import { MonsterAbilityDeckComponent } from './components/monster-ability-deck/monster-ability-deck.component';
import { SelectMonsterLevelOverrideComponent } from './components/select-monster-level-ovrerride/select-monster-level-override.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MonsterListItemComponent } from './components/active-monster-list-item/monster-list-item.component';



@NgModule({
  declarations: [
    MonsterDetailComponent,
    AddTokenDialogComponent,
    ActivateMonsterDialogComponent,
    MonsterAbilityDeckComponent,
    SelectMonsterLevelOverrideComponent,
    MonsterListItemComponent
  ],
    exports: [
        MonsterDetailComponent,
        MonsterListItemComponent
    ],
  imports: [
    CommonModule,
    DragDropModule,
    FlexLayoutModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatTooltipModule,
    TokenModule
  ]
})
export class MonsterModule { }
