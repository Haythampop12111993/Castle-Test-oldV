import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadProjectOfferImagesComponent } from './upload-project-offer-images.component';

describe('UploadProjectOfferImagesComponent', () => {
  let component: UploadProjectOfferImagesComponent;
  let fixture: ComponentFixture<UploadProjectOfferImagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadProjectOfferImagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadProjectOfferImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
