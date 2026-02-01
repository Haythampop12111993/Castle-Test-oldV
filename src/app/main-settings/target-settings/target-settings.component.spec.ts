import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetSettingsComponent } from './target-settings.component';

describe('TargetSettingsComponent', () => {
  let component: TargetSettingsComponent;
  let fixture: ComponentFixture<TargetSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TargetSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
