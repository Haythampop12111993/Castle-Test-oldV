import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionFilesComponent } from './mission-files.component';

describe('MissionFilesComponent', () => {
  let component: MissionFilesComponent;
  let fixture: ComponentFixture<MissionFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissionFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissionFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
