import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenarioLevelInputComponent } from './scenario-level-input.component';

describe('ScenarioLevelInputComponent', () => {
  let component: ScenarioLevelInputComponent;
  let fixture: ComponentFixture<ScenarioLevelInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScenarioLevelInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScenarioLevelInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
