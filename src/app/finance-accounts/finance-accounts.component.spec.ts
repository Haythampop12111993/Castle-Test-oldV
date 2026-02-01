import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceAccountsComponent } from './finance-accounts.component';

describe('FinanceAccountsComponent', () => {
  let component: FinanceAccountsComponent;
  let fixture: ComponentFixture<FinanceAccountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinanceAccountsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanceAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
