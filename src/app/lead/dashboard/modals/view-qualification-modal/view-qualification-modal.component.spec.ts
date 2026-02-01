import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewQualificationModalComponent } from './view-qualification-modal.component';

describe('ViewQualificationModalComponent', () => {
  let component: ViewQualificationModalComponent;
  let fixture: ComponentFixture<ViewQualificationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewQualificationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewQualificationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
