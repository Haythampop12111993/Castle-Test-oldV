import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractArchiveFormComponent } from './contract-archive-form.component';

describe('ContractArchiveFormComponent', () => {
  let component: ContractArchiveFormComponent;
  let fixture: ComponentFixture<ContractArchiveFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractArchiveFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractArchiveFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
