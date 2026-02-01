import { TestBed, inject } from '@angular/core/testing';

import { ReservationHelperService } from './reservation-helper.service';

describe('ReservationHelperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReservationHelperService]
    });
  });

  it('should be created', inject([ReservationHelperService], (service: ReservationHelperService) => {
    expect(service).toBeTruthy();
  }));
});
