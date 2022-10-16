import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveMonsterCardComponent } from './active-monster-card.component';

describe('AttackCardComponent', () => {
  let component: ActiveMonsterCardComponent;
  let fixture: ComponentFixture<ActiveMonsterCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActiveMonsterCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveMonsterCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
