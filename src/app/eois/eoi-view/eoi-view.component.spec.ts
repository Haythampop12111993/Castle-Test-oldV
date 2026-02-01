import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EoiViewComponent } from './eoi-view.component';

describe('EoiViewComponent', () => {
  let component: EoiViewComponent;
  let fixture: ComponentFixture<EoiViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EoiViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EoiViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
