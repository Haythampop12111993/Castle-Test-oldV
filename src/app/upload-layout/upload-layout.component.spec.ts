import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadLayoutComponent } from './upload-layout.component';

describe('UploadLayoutComponent', () => {
  let component: UploadLayoutComponent;
  let fixture: ComponentFixture<UploadLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
