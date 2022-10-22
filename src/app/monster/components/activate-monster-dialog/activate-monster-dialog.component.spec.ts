import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivateMonsterDialogComponent } from './activate-monster-dialog.component';

describe('ActivateMonsterDialogComponent', () => {
  let component: ActivateMonsterDialogComponent;
  let fixture: ComponentFixture<ActivateMonsterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivateMonsterDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivateMonsterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
