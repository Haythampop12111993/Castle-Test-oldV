import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOccasionComponent } from './add-occasion.component';

describe('AddOccasionComponent', () => {
  let component: AddOccasionComponent;
  let fixture: ComponentFixture<AddOccasionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOccasionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOccasionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
