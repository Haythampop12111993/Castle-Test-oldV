import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallCenterScriptsComponent } from './call-center-scripts.component';

describe('CallCenterScriptsComponent', () => {
  let component: CallCenterScriptsComponent;
  let fixture: ComponentFixture<CallCenterScriptsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallCenterScriptsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallCenterScriptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
