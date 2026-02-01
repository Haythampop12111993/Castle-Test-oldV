import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionActivityFormComponent } from './mission-activity-form.component';

describe('MissionActivityFormComponent', () => {
  let component: MissionActivityFormComponent;
  let fixture: ComponentFixture<MissionActivityFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissionActivityFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissionActivityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
