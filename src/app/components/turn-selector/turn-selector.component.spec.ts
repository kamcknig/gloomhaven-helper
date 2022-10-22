import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnSelectorComponent } from './turn-selector.component';

describe('TurnSelectorComponent', () => {
  let component: TurnSelectorComponent;
  let fixture: ComponentFixture<TurnSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ TurnSelectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TurnSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
