import {TestBed} from '@angular/core/testing';

import {ActionTextService} from './action-text.service';

describe('ActionTextService', () => {
  let service: ActionTextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActionTextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
