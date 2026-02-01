import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeContractArchiveComponent } from './type-contract-archive.component';

describe('TypeContractArchiveComponent', () => {
  let component: TypeContractArchiveComponent;
  let fixture: ComponentFixture<TypeContractArchiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeContractArchiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeContractArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
