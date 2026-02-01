import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRotationComponent } from './add-rotation.component';

describe('AddRotationComponent', () => {
  let component: AddRotationComponent;
  let fixture: ComponentFixture<AddRotationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRotationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
