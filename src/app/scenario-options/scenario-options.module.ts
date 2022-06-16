import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAX_LEVEL } from './max-level.token';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class ScenarioOptionsModule {
  static forRoot(options?: any) {
    return {
      ngModule: ScenarioOptionsModule,
      providers: [
        { provide: MAX_LEVEL, useValue: options?.maxScenarioLevel ?? 7 }
      ]
    }
  }
}
