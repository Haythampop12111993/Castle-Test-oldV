import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokersIncentivesComponent } from './brokers-incentives.component';

describe('BrokersIncentivesComponent', () => {
  let component: BrokersIncentivesComponent;
  let fixture: ComponentFixture<BrokersIncentivesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrokersIncentivesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokersIncentivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
