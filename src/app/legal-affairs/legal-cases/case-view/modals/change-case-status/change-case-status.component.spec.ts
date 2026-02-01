import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeCaseStatusComponent } from './change-case-status.component';

describe('ChangeCaseStatusComponent', () => {
  let component: ChangeCaseStatusComponent;
  let fixture: ComponentFixture<ChangeCaseStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeCaseStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeCaseStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
