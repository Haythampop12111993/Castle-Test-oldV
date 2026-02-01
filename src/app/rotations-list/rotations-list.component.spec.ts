import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RotationsListComponent } from './rotations-list.component';

describe('RotationsListComponent', () => {
  let component: RotationsListComponent;
  let fixture: ComponentFixture<RotationsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RotationsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RotationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
