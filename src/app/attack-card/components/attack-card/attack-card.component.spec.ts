import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttackCardComponent } from './attack-card.component';

describe('AttackCardComponent', () => {
  let component: AttackCardComponent;
  let fixture: ComponentFixture<AttackCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttackCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttackCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
