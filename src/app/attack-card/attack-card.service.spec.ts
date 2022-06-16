import { TestBed } from '@angular/core/testing';

import { AttackCardService } from './attack-card.service';

describe('AttackCardService', () => {
  let service: AttackCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttackCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
