import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalContractArchiveComponent } from './legal-contract-archive.component';

describe('LegalContractArchiveComponent', () => {
  let component: LegalContractArchiveComponent;
  let fixture: ComponentFixture<LegalContractArchiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegalContractArchiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalContractArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
