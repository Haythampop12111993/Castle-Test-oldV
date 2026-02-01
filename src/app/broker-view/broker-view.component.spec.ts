import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerViewComponent } from './broker-view.component';

describe('BrokerViewComponent', () => {
  let component: BrokerViewComponent;
  let fixture: ComponentFixture<BrokerViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrokerViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokerViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
