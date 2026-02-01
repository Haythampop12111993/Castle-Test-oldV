import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankChequeListingComponent } from './bank-cheque-listing.component';

describe('BankChequeListingComponent', () => {
  let component: BankChequeListingComponent;
  let fixture: ComponentFixture<BankChequeListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankChequeListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankChequeListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
