import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceAddTransactionComponent } from './finance-add-transaction.component';

describe('FinanceAddTransactionComponent', () => {
  let component: FinanceAddTransactionComponent;
  let fixture: ComponentFixture<FinanceAddTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinanceAddTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanceAddTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
