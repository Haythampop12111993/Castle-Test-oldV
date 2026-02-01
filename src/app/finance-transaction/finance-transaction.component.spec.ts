import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceTransactionComponent } from './finance-transaction.component';

describe('FinanceTransactionComponent', () => {
  let component: FinanceTransactionComponent;
  let fixture: ComponentFixture<FinanceTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinanceTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanceTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
