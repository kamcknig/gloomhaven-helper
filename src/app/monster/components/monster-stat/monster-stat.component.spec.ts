import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonsterStatComponent } from './monster-stat.component';

describe('ConditionEffectComponent', () => {
  let component: MonsterStatComponent;
  let fixture: ComponentFixture<MonsterStatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MonsterStatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonsterStatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
