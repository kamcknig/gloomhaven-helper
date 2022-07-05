import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonsterAbilityDeckComponent } from './monster-ability-deck.component';

describe('MonsterAbilityDeckComponent', () => {
  let component: MonsterAbilityDeckComponent;
  let fixture: ComponentFixture<MonsterAbilityDeckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonsterAbilityDeckComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonsterAbilityDeckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
