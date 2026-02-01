import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceAddAccountComponent } from './finance-add-account.component';

describe('FinanceAddAccountComponent', () => {
  let component: FinanceAddAccountComponent;
  let fixture: ComponentFixture<FinanceAddAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinanceAddAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanceAddAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
