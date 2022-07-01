import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenarioRoundComponent } from './scenario-round.component';

describe('ScenarioRoundComponent', () => {
  let component: ScenarioRoundComponent;
  let fixture: ComponentFixture<ScenarioRoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScenarioRoundComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScenarioRoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
