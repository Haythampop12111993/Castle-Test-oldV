import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseActivityFormComponent } from './case-activity-form.component';

describe('CaseActivityFormComponent', () => {
  let component: CaseActivityFormComponent;
  let fixture: ComponentFixture<CaseActivityFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseActivityFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseActivityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
