import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMonsterLevelOverrideComponent } from './select-monster-level-override.component';

describe('SelectMonsterLevelOverrideComponent', () => {
  let component: SelectMonsterLevelOverrideComponent;
  let fixture: ComponentFixture<SelectMonsterLevelOverrideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectMonsterLevelOverrideComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectMonsterLevelOverrideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
