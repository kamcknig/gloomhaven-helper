import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleStatusEffectDialogComponent } from './toggle-status-effect-dialog.component';

describe('ToggleStatusEffectDialogComponent', () => {
  let component: ToggleStatusEffectDialogComponent;
  let fixture: ComponentFixture<ToggleStatusEffectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ToggleStatusEffectDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToggleStatusEffectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
