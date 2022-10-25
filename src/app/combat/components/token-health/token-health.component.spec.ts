import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenHealthComponent } from './token-health.component';

describe('TokenHealthComponent', () => {
  let component: TokenHealthComponent;
  let fixture: ComponentFixture<TokenHealthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ TokenHealthComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TokenHealthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
