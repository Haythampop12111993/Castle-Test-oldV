import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeMissionStatusComponent } from '../../../case-view/modals/change-case-status/change-case-status.component';

describe('ChangeMissionStatusComponent', () => {
  let component: ChangeMissionStatusComponent;
  let fixture: ComponentFixture<ChangeMissionStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeMissionStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeMissionStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
