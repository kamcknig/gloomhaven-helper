import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleEffectDialog } from './toggle-effect-dialog.component';

describe('ToggleStatusEffectDialogComponent', () => {
  let component: ToggleEffectDialog;
  let fixture: ComponentFixture<ToggleEffectDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ToggleEffectDialog ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToggleEffectDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
