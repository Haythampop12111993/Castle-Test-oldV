import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCustomPaymentsComponent } from './list-custom-payments.component';

describe('ListCustomPaymentsComponent', () => {
  let component: ListCustomPaymentsComponent;
  let fixture: ComponentFixture<ListCustomPaymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCustomPaymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCustomPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
