import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonsterDetailComponent } from './monster-detail.component';

describe('AttackCardComponent', () => {
  let component: MonsterDetailComponent;
  let fixture: ComponentFixture<MonsterDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MonsterDetailComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(MonsterDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
