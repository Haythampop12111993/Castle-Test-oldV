import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomPaymentGeneratorComponent } from './custom-payment-generator.component';

describe('CustomPaymentGeneratorComponent', () => {
  let component: CustomPaymentGeneratorComponent;
  let fixture: ComponentFixture<CustomPaymentGeneratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomPaymentGeneratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomPaymentGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
