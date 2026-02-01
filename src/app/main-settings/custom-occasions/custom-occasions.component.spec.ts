import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomOccasionsComponent } from './custom-occasions.component';

describe('CustomOccasionsComponent', () => {
  let component: CustomOccasionsComponent;
  let fixture: ComponentFixture<CustomOccasionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomOccasionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomOccasionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
