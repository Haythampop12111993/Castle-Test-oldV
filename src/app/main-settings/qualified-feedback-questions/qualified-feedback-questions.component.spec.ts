import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QualifiedFeedbackQuestionsComponent } from './qualified-feedback-questions.component';

describe('QualifiedFeedbackQuestionsComponent', () => {
  let component: QualifiedFeedbackQuestionsComponent;
  let fixture: ComponentFixture<QualifiedFeedbackQuestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QualifiedFeedbackQuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QualifiedFeedbackQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
