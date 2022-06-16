import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttackCardComponent } from './components/attack-card/attack-card.component';
import { DataViewModule } from 'primeng/dataview';



@NgModule({
  declarations: [
    AttackCardComponent
  ],
  imports: [
    CommonModule,
    DataViewModule
  ]
})
export class AttackCardModule { }
