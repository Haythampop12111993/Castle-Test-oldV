import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailabilityRequestComponent } from './availability-request.component';

describe('AvailabilityRequestComponent', () => {
  let component: AvailabilityRequestComponent;
  let fixture: ComponentFixture<AvailabilityRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvailabilityRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailabilityRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
