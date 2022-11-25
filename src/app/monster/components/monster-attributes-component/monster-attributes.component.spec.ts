import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonsterAttributesComponent } from './monster-attributes.component';

describe('MonsterStatsComponentComponent', () => {
  let component: MonsterAttributesComponent;
  let fixture: ComponentFixture<MonsterAttributesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonsterAttributesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonsterAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
