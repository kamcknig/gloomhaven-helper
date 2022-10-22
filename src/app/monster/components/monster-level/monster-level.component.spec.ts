import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonsterLevelComponent } from './monster-level.component';

describe('MonsterLevelComponent', () => {
  let component: MonsterLevelComponent;
  let fixture: ComponentFixture<MonsterLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MonsterLevelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonsterLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
