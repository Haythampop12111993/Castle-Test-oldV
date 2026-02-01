import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBrokerActivityModalComponent } from './add-broker-activity-modal.component';

describe('AddBrokerActivityModalComponent', () => {
  let component: AddBrokerActivityModalComponent;
  let fixture: ComponentFixture<AddBrokerActivityModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBrokerActivityModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBrokerActivityModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
