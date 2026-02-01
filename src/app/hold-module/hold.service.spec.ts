import { TestBed, inject } from '@angular/core/testing';

import { HoldService } from './hold.service';

describe('HoldService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HoldService]
    });
  });

  it('should be created', inject([HoldService], (service: HoldService) => {
    expect(service).toBeTruthy();
  }));
});
