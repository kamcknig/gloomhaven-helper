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
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { HeaderComponent } from './components/header/header.component';
import { MatIconModule } from '@angular/material/icon';
import { defaultStoreProvider } from '@state-adapt/angular';
import { MonsterDetailComponent } from './monster/components/active-monster-card/monster-detail.component';
import { MonsterListItemComponent } from './monster/components/active-monster-list-item/monster-list-item.component';

const enableReduxDevtools = (window as any).__REDUX_DEVTOOLS_EXTENSION__?.({
  actionSanitizer,
  stateSanitizer
});

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HeaderComponent,
    MonsterDetailComponent,
    MonsterListItemComponent,
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
