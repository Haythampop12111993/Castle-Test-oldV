import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EoiComponent } from './eoi.component';

describe('EoiComponent', () => {
  let component: EoiComponent;
  let fixture: ComponentFixture<EoiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EoiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EoiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
