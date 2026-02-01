import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RotationLogsComponent } from './rotation-logs.component';

describe('RotationLogsComponent', () => {
  let component: RotationLogsComponent;
  let fixture: ComponentFixture<RotationLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RotationLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RotationLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
