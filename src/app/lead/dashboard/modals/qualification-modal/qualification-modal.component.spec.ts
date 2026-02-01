import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QualificationModalComponent } from './qualification-modal.component';

describe('QualificationModalComponent', () => {
  let component: QualificationModalComponent;
  let fixture: ComponentFixture<QualificationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QualificationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QualificationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
