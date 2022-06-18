import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DockModule } from 'primeng/dock';

import {
  createStore,
  actionSanitizer,
  stateSanitizer,
  AdaptCommon,
} from '@state-adapt/core';
import { ToolbarModule } from 'primeng/toolbar';
import { DividerModule } from 'primeng/divider';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { ScenarioOptionsModule } from './scenario-options/scenario-options.module';
import { MAX_LEVEL } from './scenario-options/max-level.token';
import { MonsterModule } from './monster/monster.module';
import { DataViewModule } from 'primeng/dataview';
import { HttpClientModule } from '@angular/common/http';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SplitButtonModule } from 'primeng/splitbutton';

const enableReduxDevtools = (window as any).__REDUX_DEVTOOLS_EXTENSION__?.({
  actionSanitizer,
  stateSanitizer
});

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    DynamicDialogModule,
    DockModule,
    ToolbarModule,
    DividerModule,
    InputNumberModule,
    FormsModule,
    ScenarioOptionsModule.forRoot(),
    MonsterModule,
    DataViewModule,
    FlexLayoutModule,
    SplitButtonModule
  ],
  providers: [
    { provide: AdaptCommon, useValue: createStore(enableReduxDevtools) },
    { provide: MAX_LEVEL, useValue: 7 },
    DialogService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
