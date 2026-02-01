import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingLeadsByRemindersComponent } from './listing-leads-by-reminders.component';

describe('ListingLeadsByRemindersComponent', () => {
  let component: ListingLeadsByRemindersComponent;
  let fixture: ComponentFixture<ListingLeadsByRemindersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListingLeadsByRemindersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListingLeadsByRemindersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
