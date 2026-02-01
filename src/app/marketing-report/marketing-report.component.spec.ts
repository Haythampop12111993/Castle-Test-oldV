import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingReportComponent } from './marketing-report.component';

describe('MarketingReportComponent', () => {
  let component: MarketingReportComponent;
  let fixture: ComponentFixture<MarketingReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketingReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
