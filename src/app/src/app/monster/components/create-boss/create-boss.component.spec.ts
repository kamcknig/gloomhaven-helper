import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateBossComponent} from './create-boss.component';

describe('BossStatSelectComponent', () => {
  let component: CreateBossComponent;
  let fixture: ComponentFixture<CreateBossComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CreateBossComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateBossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
