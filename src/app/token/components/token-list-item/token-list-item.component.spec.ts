import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenListItemComponent } from './token-list-item.component';

describe('TokenListItemComponent', () => {
  let component: TokenListItemComponent;
  let fixture: ComponentFixture<TokenListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TokenListItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TokenListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
