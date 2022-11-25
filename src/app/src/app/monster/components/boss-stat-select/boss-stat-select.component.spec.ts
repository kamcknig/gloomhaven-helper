import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BossStatSelectComponent } from './boss-stat-select.component';

describe('BossStatSelectComponent', () => {
  let component: BossStatSelectComponent;
  let fixture: ComponentFixture<BossStatSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ BossStatSelectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BossStatSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
