import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalDocumentsTypesComponent } from './legal-documents-types.component';

describe('LegalDocumentsTypesComponent', () => {
  let component: LegalDocumentsTypesComponent;
  let fixture: ComponentFixture<LegalDocumentsTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegalDocumentsTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalDocumentsTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
