import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentCollectionViewComponent } from './payment-collection-view.component';

describe('PaymentCollectionViewComponent', () => {
  let component: PaymentCollectionViewComponent;
  let fixture: ComponentFixture<PaymentCollectionViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentCollectionViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentCollectionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
