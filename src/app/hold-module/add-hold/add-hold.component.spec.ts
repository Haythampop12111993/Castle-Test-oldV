import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHoldComponent } from './add-hold.component';

describe('AddHoldComponent', () => {
  let component: AddHoldComponent;
  let fixture: ComponentFixture<AddHoldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddHoldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
