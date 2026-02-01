import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadTicketTypeComponent } from './lead-ticket-type.component';

describe('LeadTicketTypeComponent', () => {
  let component: LeadTicketTypeComponent;
  let fixture: ComponentFixture<LeadTicketTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadTicketTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadTicketTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
