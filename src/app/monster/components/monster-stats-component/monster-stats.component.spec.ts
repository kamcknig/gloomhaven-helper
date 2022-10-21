import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonsterStatsComponent } from './monster-stats.component';

describe('MonsterStatsComponentComponent', () => {
  let component: MonsterStatsComponent;
  let fixture: ComponentFixture<MonsterStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonsterStatsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonsterStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
