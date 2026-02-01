import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEoiComponent } from './add-eoi.component';

describe('AddEoiComponent', () => {
  let component: AddEoiComponent;
  let fixture: ComponentFixture<AddEoiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEoiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEoiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
