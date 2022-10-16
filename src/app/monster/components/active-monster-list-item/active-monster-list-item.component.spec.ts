import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveMonsterListItemComponent } from './active-monster-list-item.component';

describe('ActiveMonsterListItemComponent', () => {
  let component: ActiveMonsterListItemComponent;
  let fixture: ComponentFixture<ActiveMonsterListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActiveMonsterListItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveMonsterListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
