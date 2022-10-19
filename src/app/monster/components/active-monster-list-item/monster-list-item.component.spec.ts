import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonsterListItemComponent } from './monster-list-item.component';

describe('ActiveMonsterListItemComponent', () => {
  let component: MonsterListItemComponent;
  let fixture: ComponentFixture<MonsterListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonsterListItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonsterListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
