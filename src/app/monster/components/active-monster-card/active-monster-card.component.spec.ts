import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveMonsterCard } from './active-monster-card.component';

describe('AttackCardComponent', () => {
  let component: ActiveMonsterCard;
  let fixture: ComponentFixture<ActiveMonsterCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActiveMonsterCard ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveMonsterCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
