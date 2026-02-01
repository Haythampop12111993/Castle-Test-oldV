import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceBalanceSheetComponent } from './finance-balance-sheet.component';

describe('FinanceBalanceSheetComponent', () => {
  let component: FinanceBalanceSheetComponent;
  let fixture: ComponentFixture<FinanceBalanceSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinanceBalanceSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanceBalanceSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
