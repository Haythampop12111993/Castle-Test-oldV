import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentCollectionsComponent } from './payment-collections.component';

describe('PaymentCollectionsComponent', () => {
  let component: PaymentCollectionsComponent;
  let fixture: ComponentFixture<PaymentCollectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentCollectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentCollectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
