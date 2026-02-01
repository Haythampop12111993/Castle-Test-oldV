import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokersIncentivesManageComponent } from './brokers-incentives-manage.component';

describe('BrokersIncentivesManageComponent', () => {
  let component: BrokersIncentivesManageComponent;
  let fixture: ComponentFixture<BrokersIncentivesManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrokersIncentivesManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokersIncentivesManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
