import { TestBed, inject } from '@angular/core/testing';

import { LeadsService } from './lead-service.service';

describe('LeadServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LeadsService]
    });
  });

  it('should be created', inject([LeadsService], (service: LeadsService) => {
    expect(service).toBeTruthy();
  }));
});
