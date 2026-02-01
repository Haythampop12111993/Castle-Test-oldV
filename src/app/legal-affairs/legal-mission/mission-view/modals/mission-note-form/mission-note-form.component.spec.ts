import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionNoteFormComponent } from './mission-note-form.component';

describe('MissionNoteFormComponent', () => {
  let component: MissionNoteFormComponent;
  let fixture: ComponentFixture<MissionNoteFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissionNoteFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissionNoteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
