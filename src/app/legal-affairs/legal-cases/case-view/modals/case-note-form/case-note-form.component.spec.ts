import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseNoteFormComponent } from './case-note-form.component';

describe('CaseNoteFormComponent', () => {
  let component: CaseNoteFormComponent;
  let fixture: ComponentFixture<CaseNoteFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseNoteFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseNoteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
