import { TestBed, inject } from '@angular/core/testing';

import { EventsExpeditionService } from './events-expedition.service';

describe('EventsExpeditionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventsExpeditionService]
    });
  });

  it('should be created', inject([EventsExpeditionService], (service: EventsExpeditionService) => {
    expect(service).toBeTruthy();
  }));
});
