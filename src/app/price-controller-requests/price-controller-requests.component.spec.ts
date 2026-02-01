import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceControllerRequestsComponent } from './price-controller-requests.component';

describe('PriceControllerRequestsComponent', () => {
  let component: PriceControllerRequestsComponent;
  let fixture: ComponentFixture<PriceControllerRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceControllerRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceControllerRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
