import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalDocumentsComponent } from './legal-documents.component';

describe('LegalDocumentsComponent', () => {
  let component: LegalDocumentsComponent;
  let fixture: ComponentFixture<LegalDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegalDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
