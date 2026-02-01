import { TestBed, async, inject } from '@angular/core/testing';

import { BrokerIncentiveGuard } from './broker-incentive.guard';

describe('BrokerIncentiveGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BrokerIncentiveGuard]
    });
  });

  it('should ...', inject([BrokerIncentiveGuard], (guard: BrokerIncentiveGuard) => {
    expect(guard).toBeTruthy();
  }));
});
