import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalCourtsComponent } from './legal-courts.component';

describe('LegalCourtsComponent', () => {
  let component: LegalCourtsComponent;
  let fixture: ComponentFixture<LegalCourtsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegalCourtsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalCourtsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
