import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractGenerateComponent } from './contract-generate.component';

describe('ContractGenerateComponent', () => {
  let component: ContractGenerateComponent;
  let fixture: ComponentFixture<ContractGenerateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractGenerateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractGenerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
