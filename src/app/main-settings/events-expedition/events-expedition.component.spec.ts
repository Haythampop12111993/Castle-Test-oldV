import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsExpeditionComponent } from './events-expedition.component';

describe('EventsExpeditionComponent', () => {
  let component: EventsExpeditionComponent;
  let fixture: ComponentFixture<EventsExpeditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventsExpeditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsExpeditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
