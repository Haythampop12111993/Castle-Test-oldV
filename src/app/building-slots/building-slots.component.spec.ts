import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingSlotsComponent } from './building-slots.component';

describe('BuildingSlotsComponent', () => {
  let component: BuildingSlotsComponent;
  let fixture: ComponentFixture<BuildingSlotsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuildingSlotsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildingSlotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
