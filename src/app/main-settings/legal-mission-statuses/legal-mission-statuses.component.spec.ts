import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalMissionStatusesComponent } from './legal-mission-statuses.component';

describe('LegalMissionStatusesComponent', () => {
  let component: LegalMissionStatusesComponent;
  let fixture: ComponentFixture<LegalMissionStatusesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegalMissionStatusesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalMissionStatusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
