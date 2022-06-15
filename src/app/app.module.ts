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
    DockModule,
    ToolbarModule
  ],
  providers: [{provide: AdaptCommon, useValue: createStore(enableReduxDevtools)}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
