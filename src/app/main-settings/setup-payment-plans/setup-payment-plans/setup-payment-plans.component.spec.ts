import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupPaymentPlansComponent } from './setup-payment-plans.component';

describe('SetupPaymentPlansComponent', () => {
  let component: SetupPaymentPlansComponent;
  let fixture: ComponentFixture<SetupPaymentPlansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupPaymentPlansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupPaymentPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
