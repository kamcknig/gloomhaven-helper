import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { actionSanitizer, stateSanitizer, } from '@state-adapt/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScenarioOptionsModule } from './scenario-options/scenario-options.module';
import { MAX_LEVEL } from './scenario-options/max-level.token';
import { MonsterModule } from './monster/monster.module';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from './components/header/header.component';
import { ScenarioLevelInputComponent } from './components/scenario-level-input/scenario-level-input.component';
import { ScenarioRoundComponent } from './components/scenario-round/scenario-round.component';
import { MatIconModule } from '@angular/material/icon';
import { defaultStoreProvider } from '@state-adapt/angular';

const enableReduxDevtools = (window as any).__REDUX_DEVTOOLS_EXTENSION__?.({
  actionSanitizer,
  stateSanitizer
});

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ScenarioLevelInputComponent,
    ScenarioRoundComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    MatDialogModule,
    FormsModule,
    ScenarioOptionsModule.forRoot(),
    MonsterModule,
    MatDividerModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [
    defaultStoreProvider,
    { provide: MAX_LEVEL, useValue: 7 }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
