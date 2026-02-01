import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadCampaignComponent } from './lead-campaign.component';

describe('LeadCampaignComponent', () => {
  let component: LeadCampaignComponent;
  let fixture: ComponentFixture<LeadCampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadCampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
