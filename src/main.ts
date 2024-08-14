import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { defaultStoreProvider } from '@state-adapt/angular';
import { MAX_LEVEL } from './app/scenario-options/max-level.token';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([]),
    defaultStoreProvider,
    { provide: MAX_LEVEL, useValue: 7 },
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations()
  ]
})
  .catch(err => console.error(err));
