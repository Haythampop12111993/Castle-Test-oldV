import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColdCallsStatusesComponent } from './cold-calls-statuses.component';

describe('ColdCallsStatusesComponent', () => {
  let component: ColdCallsStatusesComponent;
  let fixture: ComponentFixture<ColdCallsStatusesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColdCallsStatusesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColdCallsStatusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
