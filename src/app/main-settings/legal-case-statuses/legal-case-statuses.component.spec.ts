import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalCaseStatusesComponent } from './legal-case-statuses.component';

describe('LegalCaseStatusesComponent', () => {
  let component: LegalCaseStatusesComponent;
  let fixture: ComponentFixture<LegalCaseStatusesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegalCaseStatusesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalCaseStatusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
