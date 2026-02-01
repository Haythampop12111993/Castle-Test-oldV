import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceControlComponent } from './price-control.component';

describe('PriceControlComponent', () => {
  let component: PriceControlComponent;
  let fixture: ComponentFixture<PriceControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
