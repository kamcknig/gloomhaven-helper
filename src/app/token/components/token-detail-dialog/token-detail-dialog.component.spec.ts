import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TokenDetailDialogComponent} from './token-detail-dialog.component';

describe('ToggleStatusEffectDialogComponent', () => {
  let component: TokenDetailDialogComponent;
  let fixture: ComponentFixture<TokenDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ TokenDetailDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TokenDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
